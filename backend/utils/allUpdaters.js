const adbUpdater = require('./adbUpdater');

async function runAllUpdaters() {
  console.log('⏳ Запуск обновления всех сеток...');

  const updaters = [
    { name: 'adbUpdater', func: adbUpdater.fetchAdbLeads } // Вызов метода
  ];

  for (const { name, func } of updaters) {
    try {
      await func(); // Запуск метода
      console.log(`✅ ${name} выполнен успешно`);
    } catch (error) {
      console.error(`Ошибка в ${name}:`, error.message);
    }
  }

  console.log('Все обновления завершены.');
}

runAllUpdaters()
// Функция для запуска обновления раз в сутки
function startCronJob() {
  const now = new Date();
  const nextRun = new Date();
  nextRun.setHours(3, 0, 0, 0); // Запуск в 03:00 ночи

  let delay = nextRun.getTime() - now.getTime();
  if (delay < 0) {
    // Если уже после 03:00, запустить завтра
    delay += 24 * 60 * 60 * 1000;
  }

  console.log(`Следующее обновление через ${Math.round(delay / 1000 / 60)} минут`);

  setTimeout(async function run() {
    await runAllUpdaters();

    // Повторять каждую ночь
    setTimeout(run, 24 * 60 * 60 * 1000);
  }, delay);
}


module.exports = { startCronJob };
