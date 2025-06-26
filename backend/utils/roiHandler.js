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

// Функция для получения IP-адреса пользователя
function getUserIP(req) {
  const ipHeaders = [
    'x-forwarded-for', 'x-forwarded', 'x-cluster-client-ip', 
    'forwarded-for', 'forwarded', 'remote-address'
  ];

  for (const header of ipHeaders) {
    if (req.headers[header]) {
      return req.headers[header].split(',')[0].trim();
    }
  }
  return req.connection.remoteAddress || '0.0.0.0';
}

// Функция для отправки данных на API
async function sendDataToAPI(data, req) {
  const phone = data.phone;
  const phonecc = data.phonecc;
  const phoneNumber = `${phonecc}${phone.replace(/[^0-9]/g, '')}`;

  const apiData = {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    password: data.password,
    phone: phoneNumber,
    ip: data.ip,
    custom5: data.click_id,
    comment: null,
    offerName: data.offerName
  };

  try {
    console.log('Sending data to API:', apiData);

    // Отправка данных на API
    const response = await axios.post(API_URL, apiData, {
      headers: {
        'Api-Key': API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: agent
    });

    console.log('API response:', response.data);

    if (response.data) {
      return {
        message: 'Data sent successfully',
        status: response.status,
        response: response.data
      };
    } else {
      throw new Error("No response from API");
    }
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    console.error('Error sending data:', errorMessage);
    throw new Error(`Error sending data: ${JSON.stringify(errorMessage)}`);
  }
}

// Функция для обработки данных формы и сохранения в базу данных
async function handleFormData(data, req) {
  try {
    const lead = await Lead.create({
      name: data.name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      ip: data.ip,
      phone: data.phone,
      country: data.country,
      offer_name: data.offerName,
      click_id: data.click_id,
      network: 'roi',
      status: 'pending', // Статус по умолчанию
      created_at: new Date(),
      updated_at: new Date()
    });

    const apiResponse = await sendDataToAPI(data, req);

    // Обновление статуса в базе данных на основе ответа API
    await lead.update({ status: apiResponse.status === 200 ? 'success' : 'error' });

    return { lead, apiResponse };
  } catch (error) {
    console.error('Error handling form data:', error.message);
    throw new Error(`Error handling form data: ${error.message}`);
  }
}

module.exports = { sendDataToAPI, handleFormData };
