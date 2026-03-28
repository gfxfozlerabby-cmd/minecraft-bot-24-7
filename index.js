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
        console.log('নুব বট আবার ফিরে এসেছে! 🕹️');
        const mcData = require('minecraft-data')(bot.version);
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);

        // বাড়িতে টেলিপোর্ট
        bot.chat('/tp Justice_Player 861 76 -1014');

        // --- নুব স্টাইল অগোছালো কাজ (Script) ---
        setInterval(() => {
            if (bot.isSleeping) return;

            const randomAction = Math.random();

            if (randomAction < 0.3) {
                // ১. অকারণে এদিক সেদিক হাঁটা
                const x = 861 + (Math.floor(Math.random() * 10) - 5);
                const z = -1014 + (Math.floor(Math.random() * 10) - 5);
                bot.pathfinder.setGoal(new goals.GoalNear(x, 76, z, 1));
            } 
            else if (randomAction < 0.5) {
                // ২. সামনের কোনো ব্লককে অকারণে ঘুষি মারা (Punching/Mining)
                const block = bot.blockAtCursor(4);
                if (block && block.name !== 'air') {
                    bot.dig(block).catch(() => {});
                }
            }
            else if (randomAction < 0.7) {
                // ৩. অকারণে লাফানো এবং আকাশের দিকে তাকিয়ে থাকা
                bot.setControlState('jump', true);
                bot.look(Math.random() * 6, (Math.random() - 0.5) * 2);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 5000); // প্রতি ৫ সেকেন্ডে নতুন নুব কাজ করবে
    });

    // রাত হলে ঘুমানোর নুব অভ্যাস
    bot.on('time', () => {
        if (bot.time.timeOfDay >= 13000 && bot.time.timeOfDay <= 23000) {
            const bed = bot.findBlock({ matching: block => bot.isABed(block), maxDistance: 5 });
            if (bed) bot.sleep(bed).catch(() => {});
        } else if (bot.isSleeping) {
            bot.wake().catch(() => {});
        }
    });

    // অটো রি-কানেক্ট
    bot.on('end', () => setTimeout(createBot, 5000));
    bot.on('error', (err) => console.log('Error:', err.message));
}

createBot();
