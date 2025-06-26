// scheduler.js
const cron = require('node-cron');
const { fetchRainLeads } = require('./utils/rainUpdater');

// Настройка задачи на выполнение каждый день в 14:00
cron.schedule('00 08 * * *', () => {
  console.log('Starting daily update for Rain leads at 14:00...');
  fetchRainLeads();
});
