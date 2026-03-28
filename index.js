const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'fozlerabby.falixsrv.me', 
        port: 28663,                    
        username: 'Justice_Player',     
        version: '1.21.1',
        connectTimeout: 90000 // ১.৫ মিনিট সময় দেবে কানেক্ট হতে
    });

    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('বট এখন পুরোপুরি শান্ত! 🧘‍♂️');
        // সাথে সাথে কমান্ড না দিয়ে ৫ সেকেন্ড পর দিবে
        setTimeout(() => {
            bot.chat('/tp Justice_Player 861 76 -1014');
        }, 5000);
    });

    // রাত হলে ঘুমানোর অংশ
    bot.on('time', () => {
        if (bot.time.timeOfDay >= 13000 && bot.time.timeOfDay <= 23000) {
            if (!bot.isSleeping) {
                const bed = bot.findBlock({ matching: block => bot.isABed(block), maxDistance: 10 });
                if (bed) bot.sleep(bed).catch(() => {});
            }
        } else if (bot.isSleeping) {
            bot.wake().catch(() => {});
        }
    });

    // বের হয়ে গেলে ১০ সেকেন্ড অপেক্ষা করে আবার ঢুকবে (যাতে লুপ না হয়)
    bot.on('end', () => {
        console.log('ডিসকানেক্ট হয়েছে, ১০ সেকেন্ড পর চেষ্টা করছি...');
        setTimeout(createBot, 10000); 
    });

    bot.on('error', (err) => console.log('Error Log:', err.message));
}

createBot();
