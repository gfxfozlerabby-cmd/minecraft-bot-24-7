const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'fozlerabby.falixsrv.me', // এখানে তোমার সার্ভার আইপি বসাও
  port: 28663,             
  username: 'Justice_Player',
  version: '1.21.1'
});

bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
  console.log('বট সার্ভারে রেডি!');
  const mcData = require('minecraft-data')(bot.version);
  const movements = new Movements(bot, mcData);
  bot.pathfinder.setMovements(movements);
});

// অটো অ্যাটাক মোড (১৬ ব্লকের ভেতর জম্বি থাকলে মারবে)
bot.on('physicsTick', () => {
  const entity = bot.nearestEntity((e) => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16);
  if (entity) {
    bot.lookAt(entity.position.offset(0, entity.height, 0));
    bot.attack(entity);
  }
});

bot.on('error', (err) => console.log('Error:', err));
bot.on('kicked', (reason) => console.log('Kicked for:', reason));
