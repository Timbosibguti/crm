const axios = require('axios');
const { Lead } = require('../models');
const moment = require('moment');

// Конфигурация API
const API_URL = '';
const tokens = '';

// Функция для получения данных от Adb API
async function fetchAdbLeads() {
  try {
    console.log('Fetching leads from Adb API...');
    
    const from = moment().subtract(1, 'days').format('YYYY-MM-DD'); // Начало вчерашнего дня
    const to = moment().format('YYYY-MM-DD'); // Сегодняшний день

    console.log('Sending request to:', API_URL);
    console.log('With parameters:', { token: tokens, from, to });

    const response = await axios.get(API_URL, {
      params: { token: tokens, from, to }
    });

    console.log('Adb API response:', response.data);

    await updateLeadStatuses(response.data);
  } catch (error) {
    console.error('Error fetching data from Adb API:', error.message);
  }
}

// Функция для обновления статусов лидов в базе данных
async function updateLeadStatuses(leads) {
  try {
    for (const lead of leads) {
      console.log(Processing lead ${lead.id}: status=${lead.sale_status});

      const [updated] = await Lead.update(
        { status: lead.sale_status, updated_at: new Date() },
        { where: { lead_uuid: lead.id } }
      );

      if (updated === 0) {
        console.warn(No existing lead found with lead_uuid=${lead.id}, skipping update.);
      }
    }
    console.log('Lead statuses updated successfully.');
  } catch (error) {
    console.error('Error updating lead statuses:', error.message);
  }
}

module.exports = { fetchAdbLeads };