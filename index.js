const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
const http = require('http');

// Cron-job এর জন্য হালকা ওজনের সার্ভার
http.createServer((req, res) => {
    res.writeHead(200);
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
    bot.loadPlugin(pvp);

    bot.on('spawn', () => {
        console.log('বট সচল এবং আত্মরক্ষার জন্য প্রস্তুত! ⚔️');
        
        // টেলিপোর্ট কমান্ড
        setTimeout(() => bot.chat('/tp Justice_Player 861 76 -1014'), 5000);
        
        // প্রতি ১০ সেকেন্ডে চেক করবে কোনো শত্রু আশেপাশে আছে কি না
        setInterval(() => {
            const mcData = require('minecraft-data')(bot.version);
            const target = bot.nearestEntity(entity => {
                return entity.type === 'mob' && 
                       (entity.mobType === 'Zombie' || entity.mobType === 'Skeleton' || entity.mobType === 'Creeper');
            });

            if (target) {
                bot.pvp.attack(target); // শত্রু দেখলে আক্রমণ করবে
            }
        }, 2000);
    });

    // মারা গেলে সাথে সাথে Respawn
    bot.on('death', () => {
        console.log('মারা গেছি, আবার ফিরে আসছি...');
        setTimeout(() => bot.respawn(), 5000);
    });

    bot.on('end', () => setTimeout(createBot, 30000));
    bot.on('error', (err) => console.log('Error:', err.message));
}

createBot();
