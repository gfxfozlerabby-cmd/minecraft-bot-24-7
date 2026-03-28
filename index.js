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
        console.log('বট সচল! এখন সে নড়াচড়া করবে। 🏃‍♂️');
        const mcData = require('minecraft-data')(bot.version);
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);
        
        // বাড়িতে টেলিপোর্ট
        bot.chat('/tp Justice_Player 861 76 -1014');

        // --- নড়াচড়া করার মেইন লুপ ---
        setInterval(() => {
            if (bot.isSleeping) return;

            const rand = Math.random();
            if (rand < 0.4) {
                // ৮ ব্লকের মধ্যে এদিক সেদিক হাঁটবে
                const x = 861 + (Math.floor(Math.random() * 16) - 8);
                const z = -1014 + (Math.floor(Math.random() * 16) - 8);
                bot.pathfinder.setGoal(new goals.GoalNear(x, 76, z, 1));
            } else if (rand < 0.7) {
                // অকারণে আকাশ দেখবে আর লাফাবে
                bot.setControlState('jump', true);
                bot.look(Math.random() * 6.28, (Math.random() - 0.5) * 1.2);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 8000); // প্রতি ৮ সেকেন্ডে নতুন কাজ করবে
    });

    // রাত হলে ঘুমানোর স্ক্রিপ্ট
    bot.on('time', () => {
        const time = bot.time.timeOfDay;
        if (time >= 13000 && time <= 23000) {
            if (!bot.isSleeping) {
                const bed = bot.findBlock({ matching: block => bot.isABed(block), maxDistance: 10 });
                if (bed) bot.sleep(bed).catch(() => {});
            }
        } else if (bot.isSleeping) {
            bot.wake().catch(() => {});
        }
    });

    bot.on('end', () => setTimeout(createBot, 10000));
    bot.on('error', (err) => console.log('Error Log:', err.message));
}

createBot();
