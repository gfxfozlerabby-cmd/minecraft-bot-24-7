const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'fozlerabby.falixsrv.me', 
  port: 28663,                    
  username: 'Justice_Player',     
  version: '1.21.1'               
});

bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
  console.log('Justice_Player এখন একজন নুব প্লেয়ারের মতো খেলবে! 🕹️');
  const mcData = require('minecraft-data')(bot.version);
  const movements = new Movements(bot, mcData);
  bot.pathfinder.setMovements(movements);

  // নুব প্লেয়ারের মতো অগোছালো কাজ করা
  setInterval(() => {
    const randomAction = Math.random();

    if (randomAction < 0.4) {
      // ১. অকারণে একটু সামনে-পিছে হাঁটা
      const x = Math.floor(Math.random() * 6) - 3;
      const z = Math.floor(Math.random() * 6) - 3;
      const pos = bot.entity.position.offset(x, 0, z);
      bot.pathfinder.setGoal(new goals.GoalNear(pos.x, pos.y, pos.z, 1));
    } 
    else if (randomAction < 0.7) {
      // ২. অকারণে লাফ দেওয়া (Jump)
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    } 
    else {
      // ৩. আকাশের দিকে বা চারদিকে হাঁ করে তাকিয়ে থাকা
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch);
    }
  }, 5000); // প্রতি ৫ সেকেন্ড পর পর নতুন কোনো নুব কাজ করবে
});

// কেউ চ্যাটে কিছু লিখলে নুব স্টাইলে উত্তর দেওয়া
bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  if (message.includes('hello') || message.includes('hi')) {
    bot.chat('Hi! I am noob Justice_Player :P');
  }
});

bot.on('error', (err) => console.log('Error:', err));
bot.on('kicked', (reason) => console.log('Kicked for:', reason));
