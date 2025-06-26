const axios = require('axios');
const { Lead } = require('../models');
const moment = require('moment');

// Конфигурация API
const API_URL = '';
const API_KEY = '';

// Функция для получения данных от Cryp API
async function fetchCrypLeads() {
  try {
    // Определение даты начала и конца
    const createdFrom = moment().subtract(1, 'days').startOf('day').toISOString(); // Начало вчерашнего дня
    const createdTo = moment().startOf('day').toISOString(); // Начало текущего дня

    // Выполнение GET запроса
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `${API_KEY}`
      },
      params: {
        created_from: createdFrom,
        created_to: createdTo
      }
    });

    console.log('Cryp API response:', response.data);

    // Обработка данных и обновление статуса
    await updateLeadStatuses(response.data);
  } catch (error) {
    console.error('Error fetching data from Cryp API:', error.message);
  }
}
fetchCrypLeads();

// Функция для обновления статусов лидов в базе данных
async function updateLeadStatuses(leads) {
  try {
    for (const lead of leads) {
      console.log(`Updating lead ${lead.leadUuid}: status=Fara`); // Логирование значений

      const [updated] = await Lead.update(
        {
          salestatus: lead.saleStatus, // Обновляем поле salestatus
        },
        {
          where: { lead_uuid: lead.leadUuid } // Обновляем лид по полю lead_uuid
        }
      );

      if (updated === 0) {
        console.warn(`No lead found with lead_uuid=${lead.leadUuid}`);
      }
    }
    console.log('Lead statuses updated successfully.');
  } catch (error) {
    console.error('Error updating lead statuses:', error.message);
  }
}

module.exports = { fetchCrypLeads };

