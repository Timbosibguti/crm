const axios = require('axios');
const https = require('https');
const { Lead } = require('../models');
const querystring = require('querystring');

// Конфигурация SSL
const agent = new https.Agent({
  rejectUnauthorized: false
});

// URL и ключи
const API_URL = '';

// Функция для отправки данных на API
async function sendDataToAPI(data, req) {
  const apiData = querystring.stringify({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    area_code: data.phonecc,
    password: data.password,
    _ip: data.ip,
    aff_sub5: data.click_id,
    affid: 123123,
    hitid: data.click_id,
    funnel: data.offerName
  });

  try {
    console.log('Sending data to API:', apiData);

    // Отправка данных на API
    const response = await axios.post(API_URL, apiData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
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
    let extractedMessage = '';
    if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
      extractedMessage = error.response.data.errors.join(', ');
    } else {
      extractedMessage = errorMessage.message || errorMessage;
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
      name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      ip: data.ip,
      phone: data.phonecc + data.phone,
      country: data.country,
      offer_name: data.offerName,
      click_id: data.click_id,
      network: 'adb',
      status: 'pending', // Статус по умолчанию
      created_at: new Date(),
      updated_at: new Date()
    });

    // Отправка данных на API
    const apiResponse = await sendDataToAPI(data, req);

    // Обновление статуса и UUID в базе данных на основе ответа API
    await lead.update({
      status: apiResponse.status,
      lead_uuid: apiResponse.response?.lead?.id || null,
      advertiser_uuid: apiResponse.response?.advertiser_uuid || null,
      message: apiResponse.error || null
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
