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
        console.log('বট এখন লাইভ! 🏃‍♂️');
        bot.chat('/tp Justice_Player 861 76 -1014');
    });

    // রাত হলে ঘুমানোর অংশ
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

    bot.on('end', () => setTimeout(createBot, 5000));
    bot.on('error', (err) => console.log('Error:', err.message));
}

createBot();
