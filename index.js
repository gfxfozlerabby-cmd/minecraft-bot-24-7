const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const http = require('http');

// Render-কে শান্ত রাখার জন্য Fake Server
http.createServer((req, res) => {
    res.write("Justice Player is Running!");
    res.end();
}).listen(3000);

function createBot() {
    console.log('কানেক্ট করার চেষ্টা করছি... ১০ সেকেন্ড অপেক্ষা করুন।');
    
    const bot = mineflayer.createBot({
        host: 'fozlerabby.falixsrv.me', 
        port: 28663,                    
        username: 'Justice_Player',     
        version: '1.21.1',
        connectTimeout: 60000 // ১ মিনিট পর্যন্ত অপেক্ষা করবে
    });

    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('সফলভাবে জয়েন করেছে! 🏃‍♂️');
        const mcData = require('minecraft-data')(bot.version);
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);
        
        // জয়েন করার ৫ সেকেন্ড পর টেলিপোর্ট হবে
        setTimeout(() => {
            bot.chat('/tp Justice_Player 861 76 -1014');
        }, 5000);

        // নুব স্টাইল মুভমেন্ট (দিনের বেলা)
        setInterval(() => {
            if (bot.isSleeping) return;
            const rand = Math.random();
            if (rand < 0.3) {
                const x = 861 + (Math.floor(Math.random() * 10) - 5);
                const z = -1014 + (Math.floor(Math.random() * 10) - 5);
                bot.pathfinder.setGoal(new goals.GoalNear(x, 76, z, 1));
            } else if (rand < 0.5) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 10000); // ১০ সেকেন্ড পরপর কাজ করবে (যাতে সার্ভার লোড না নেয়)
    });

    // রাত হলে ঘুমানো
    bot.on('time', () => {
        const time = bot.time.timeOfDay;
        if (time >= 13000 && time <= 23000 && !bot.isSleeping) {
            const bed = bot.findBlock({ matching: block => bot.isABed(block), maxDistance: 10 });
            if (bed) bot.sleep(bed).catch(() => {});
        } else if (bot.isSleeping && time < 13000) {
            bot.wake().catch(() => {});
        }
    });

    // যদি কিক খায়, তবে ২০ সেকেন্ড পর আবার চেষ্টা করবে (লুপ ঠেকানোর জন্য)
    bot.on('end', () => {
        console.log('ডিসকানেক্ট হয়েছে। ২০ সেকেন্ড পর আবার চেষ্টা করবো...');
        setTimeout(createBot, 20000);
    });

    bot.on('error', (err) => console.log('Error Log:', err.message));
}

// প্রথমবার স্টার্ট করার আগে একটু সময় নেবে
setTimeout(createBot, 5000);
