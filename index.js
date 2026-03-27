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
        console.log('Justice_Player এখন পুরোপুরি অটোমেটিক! 😴⚔️');
        const mcData = require('minecraft-data')(bot.version);
        const movements = new Movements(bot, mcData);
        bot.pathfinder.setMovements(movements);

        // বাড়িতে অটো টেলিপোর্ট
        bot.chat('/tp Justice_Player 861 76 -1014');
    });

    // 🌙 রাত হলে অটো ঘুমানোর ফাংশন
    bot.on('time', () => {
        const time = bot.time.timeOfDay;
        
        // মাইনক্রাফটে ১৩০০০ থেকে ২৩০০০ সময় মানে হলো রাত
        if (time >= 13000 && time <= 23000) {
            if (!bot.isSleeping) {
                // আশেপাশে ১০ ব্লকের মধ্যে বিছানা খোঁজা
                const bed = bot.findBlock({
                    matching: block => bot.isABed(block),
                    maxDistance: 10
                });

                if (bed) {
                    bot.sleep(bed).catch(err => console.log('এখন ঘুমানো যাচ্ছে না:', err.message));
                }
            }
        } else if (bot.isSleeping) {
            // সকাল হলে অটো উঠে যাওয়া
            bot.wake().catch(err => console.log('উঠতে পারছি না:', err.message));
        }
    });

    // ⚔️ জম্বি/ক্রিপার দেখলে অটো ফাইট এবং অস্ত্র নেওয়া
    bot.on('physicsTick', async () => {
        if (bot.isSleeping) return; // ঘুমানোর সময় ফাইট করবে না

        const entity = bot.nearestEntity((e) => 
            (e.type === 'mob') && e.position.distanceTo(bot.entity.position) < 12
        );

        if (entity) {
            // ব্যাগ থেকে তলোয়ার বের করা
            const sword = bot.inventory.items().find(item => item.name.includes('sword'));
            if (sword) await bot.equip(sword, 'hand');
            
            bot.lookAt(entity.position.offset(0, entity.height, 0));
            bot.attack(entity);
        }
    });

    // বের হয়ে গেলে অটো রিস্টার্ট
    bot.on('end', () => setTimeout(createBot, 2000));
    bot.on('error', (err) => console.log('Error:', err));
}

createBot();
