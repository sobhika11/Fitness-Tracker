const cron = require('node-cron');
const User = require('../models/User'); // Ensure this matches your actual User model path
const DailyLog = require('../models/DailyLog');
const { sendReminderEmail } = require('./mailer');

const motivationalMessages = [
  "Hey! You haven’t logged your meals today. Stay consistent 💪",
  "Your streak is at risk! Log your meals before the day ends 🔥",
  "Consistency is key to results! Drop in and log your meals for today 🚀",
  "Don't let today slip away. Take a minute to log your nutrition! 🥗"
];

cron.schedule('0 20 * * *', async () => {
  console.log('⏳ Running daily reminder cron job at 8 PM...');
  
  try {
    const today = new Date().toISOString().split("T")[0]; 
    const users = await User.find({});
    for (const user of users) {
      if (!user.email) continue;
      const log = await DailyLog.findOne({ userId: user._id, date: today });
      let missedLogging = false;
      if (!log) {
        missedLogging = true;
      } else {
        const { breakfast, lunch, dinner } = log.meals || {};
        if (breakfast === 'skipped' && lunch === 'skipped' && dinner === 'skipped') {
          missedLogging = true;
        }
      }

      if (missedLogging) {
        if (log && log.streakCompleted) {
          log.streakCompleted = false;
          await log.save();
        }
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        await sendReminderEmail(user.email, randomMessage);
      } else {
        if (log && !log.streakCompleted) {
          log.streakCompleted = true;
          await log.save();
        }
      }
    }
    
    console.log('✅ Daily reminder cron job completed successfully.');
  } catch (error) {
    console.error('❌ Error in daily reminder cron job:', error);
  }
});

module.exports = cron;
