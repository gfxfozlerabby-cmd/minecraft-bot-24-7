const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'fozlerabby.falixsrv.me', 
        port: 28663,                    
        username: 'Justice_Player',     
        version: '1.21.1'
    });

    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('বট সচল! 🏃‍♂️');
        bot.chat('/tp Justice_Player 861 76 -1014');
    });

    // বের হয়ে গেলে আবার ঢুকবে
    bot.on('end', () => setTimeout(createBot, 5000));
    bot.on('error', (err) => console.log('Log:', err.message));
}

createBot();
    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('নুব বট এখন ঘুমাতেও জানে! 💤');
        const mcData = require('minecraft-data')(bot.version);
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);
        
        // বাড়িতে টেলিপোর্ট
        bot.chat('/tp Justice_Player 861 76 -1014');

        // --- নুব স্টাইল অগোছালো কাজ (দিনের বেলা) ---
        setInterval(() => {
            if (bot.isSleeping) return; // ঘুমানোর সময় ডিস্টার্ব করবে না

            const rand = Math.random();
            if (rand < 0.25) {
                // ১. অকারণে এদিক সেদিক হাঁটা (৮ ব্লকের মধ্যে)
                const x = 861 + (Math.floor(Math.random() * 16) - 8);
                const z = -1014 + (Math.floor(Math.random() * 16) - 8);
                bot.pathfinder.setGoal(new goals.GoalNear(x, 76, z, 1));
            } else if (rand < 0.5) {
                // ২. অকারণে লাফানো আর আকাশ দেখা
                bot.setControlState('jump', true);
                bot.look(Math.random() * 6, (Math.random() - 0.5) * 1.5);
                setTimeout(() => bot.setControlState('jump', false), 500);
            } else if (rand < 0.7) {
                // ৩. সামনের ব্লককে অকারণে ঘুষি মারা (নুব স্টাইল)
                const targetBlock = bot.blockAtCursor(4);
                if (targetBlock && targetBlock.name !== 'air') {
                    bot.dig(targetBlock).catch(() => {});
                }
            }
        }, 7000); 
    });

    // --- ৪. অটো ঘুমানোর স্ক্রিপ্ট ---
    bot.on('time', () => {
        const time = bot.time.timeOfDay;
        if (time >=
