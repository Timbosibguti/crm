const axios = require('axios');
const https = require('https');
const { Lead } = require('../models');

// Конфигурация SSL
const agent = new https.Agent({
  rejectUnauthorized: false
});

// URL и ключи
const API_URL = '';
const API_KEY = '';

// Функция для отправки данных на API
async function sendDataToAPI(data, req) {
  const phone = data.phone;
  const phonecc = data.phonecc;
  const phoneNumber = `${phonecc}${phone.replace(/[^0-9]/g, '')}`;

  const apiData = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: phoneNumber,
    country_code: data.country,
    password: data.password,
    ip: data.ip,
    affiliate_id: '',
    offer_id: '',
    aff_sub: data.click_id,
    aff_sub4: data.offerName
  };

  try {
    console.log('Sending data to API:', apiData);

    // Отправка данных на API
    const response = await axios.post(API_URL, apiData, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      httpsAgent: agent
    });

    console.log('API response:', response.data);

    return {
      status: response.status,
      response: response.data
    };
  } catch (error) {
    const statusCode = error.response ? error.response.status : 'Unknown';
    const errorMessage = error.response ? error.response.data : error.message;
    console.error('Error sending data:', errorMessage);

    // Извлечение сообщения об ошибке из массива
    let extractedMessage = errorMessage.message || errorMessage;
    if (Array.isArray(errorMessage.data)) {
      extractedMessage = errorMessage.data.map(err => err.message).join(', ');
    }

    return {
      status: statusCode,
      error: extractedMessage
    };
  }
}

// Функция для обработки данных формы и сохранения в базу данных
async function handleFormData(data, req) {
  let lead;
  try {
    // Создание записи в базе данных
    lead = await Lead.create({
      name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      password: data.password || '',
      ip: data.ip || '', 
      phone: data.phone || '', 
      country: data.country || '', 
      offer_name: data.offerName || '', 
      click_id: data.click_id || '', 
      network: 'rain',
      status: 'pending', // Статус по умолчанию
      created_at: new Date(),
      updated_at: new Date()
    });

    // Отправка данных на API
    const apiResponse = await sendDataToAPI(data, req);

    // Обновление статуса и UUID в базе данных на основе ответа API
    await lead.update({
      status: apiResponse.status,
      lead_uuid: apiResponse.response?.lead_uuid || '',
      advertiser_uuid: apiResponse.response?.advertiser_uuid || '',
      message: apiResponse.error || ''
    });

    return { lead, apiResponse };
  } catch (error) {
    console.error('Error handling form data:', error.message);

    // Если ошибка произошла после создания записи, обновляем её статус
    if (lead) {
      const statusCode = error.message.includes('Validation Error') ? 422 : 'error';
      const extractedMessage = error.message.includes('Validation Error') && error.response && error.response.data && Array.isArray(error.response.data.data)
        ? error.response.data.data.map(err => err.message).join(', ')
        : error.message;

      console.error('Updating lead status due to error:', statusCode);
      await lead.update({ 
        status: statusCode === 'Unknown' ? 'error' : statusCode,
        message: extractedMessage
      });
    } else {
      console.error('Error handling form data (no lead):', error.message);
    }

    throw new Error(`Error handling form data: ${error.message}`);
  }
}

module.exports = { sendDataToAPI, handleFormData };
