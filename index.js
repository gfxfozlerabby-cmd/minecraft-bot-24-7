const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const http = require('http');

// ১. Render-এর ফ্রি টায়ারের পোর্ট সমস্যা সমাধানের জন্য (Fake Server)
http.createServer((req, res) => {
    res.write("Justice Player is Online!");
    res.end();
}).listen(3000);

function createBot() {
    const bot = mineflayer.createBot({
        host: 'fozlerabby.falixsrv.me', 
        port: 28663,                    
        username: 'Justice_Player',     
        version: '1.21.1'
    });

    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('নুব বট এখন লাইভ এবং ফ্রিতে চলছে! 🏃‍♂️');
        const mcData = require('minecraft-data')(bot.version);
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);
        
        // বাড়িতে টেলিপোর্ট
        setTimeout(() => {
            bot.chat('/tp Justice_Player 861 76 -1014');
        }, 5000);

        // --- ২. নুব স্টাইল অগোছালো কাজ (দিনের বেলা) ---
        setInterval(() => {
            if (bot.isSleeping) return;

            const rand = Math.random();
            if (rand < 0.3) {
                // অকারণে এদিক সেদিক হাঁটা (৮ ব্লকের মধ্যে)
                const x = 861 + (Math.floor(Math.random() * 16) - 8);
                const z = -1014 + (Math.floor(Math.random() * 16) - 8);
                bot.pathfinder.setGoal(new goals.GoalNear(x, 76, z, 1));
            } else if (rand < 0.5) {
                // অকারণে লাফানো আর আকাশের দিকে তাকানো
                bot.setControlState('jump', true);
                bot.look(Math.random() * 6, (Math.random() - 0.5) * 2);
                setTimeout(() => bot.setControlState('jump', false), 500);
            } else if (rand < 0.7) {
                // সামনের ব্লককে ঘুষি মারা (নুব স্টাইল)
                const targetBlock = bot.blockAtCursor(4);
                if (targetBlock && targetBlock.name !== 'air') {
                    bot.dig(targetBlock).catch(() => {});
                }
            }
        }, 8000); 
    });

    // --- ৩. রাত হলে ঘুমানোর নুব অভ্যাস ---
    bot.on('time', () => {
        const time = bot.time.timeOfDay;
        if (time >= 13000 && time <= 23000) {
            if (!bot.isSleeping) {
                const bed = bot.findBlock({
                    matching: block => bot.isABed(block),
                    maxDistance: 10
                });
                if (bed) bot.sleep(bed).catch(() => {});
            }
        } else if (bot.isSleeping) {
            bot.wake().catch(() => {});
        }
    });

    // ডিসকানেক্ট হলে ১০ সেকেন্ড পর আবার চেষ্টা
    bot.on('end', () => setTimeout(createBot, 10000));
    bot.on('error', (err) => console.log('Error Log:', err.message));
}

createBot();
