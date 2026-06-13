const cron = require('node-cron');
const Document = require('../models/Document');
const Person = require('../models/Person');
const { sendEmailNotification } = require('./emailService');

/**
 * Scan database for documents requiring reminder emails and send them.
 * This can be run on a schedule or triggered manually.
 */
const checkAndSendReminders = async () => {
  console.log(`⏰ [${new Date().toISOString()}] Starting document expiry scan...`);
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find documents:
    // 1. Where isMuted is false (reminders are active)
    // 2. Today is >= reminderStartDate (time to start reminding)
    const expiringDocs = await Document.find({
      isMuted: false,
      reminderStartDate: { $lte: today }
    }).populate('personId');

    console.log(`Found ${expiringDocs.length} active documents matching reminder criteria.`);

    let sentCount = 0;
    let failedCount = 0;

    for (const doc of expiringDocs) {
      // If personId is missing (person was deleted), skip this document
      if (!doc.personId) {
        console.warn(`⚠️ Warning: Document ${doc.docName} has no associated person. Skipping.`);
        continue;
      }

      // Check if we already sent an email today to avoid flooding
      const lastReminded = doc.lastRemindedAt ? new Date(doc.lastRemindedAt) : null;
      if (lastReminded) {
        lastReminded.setHours(0, 0, 0, 0);
        if (lastReminded.getTime() === today.getTime()) {
          console.log(`ℹ️ Already sent reminder today for "${doc.docName}" (${doc.personId.name}). Skipping.`);
          continue;
        }
      }

      const isExpired = today > new Date(doc.expiryDate);

      try {
        await sendEmailNotification({
          eventType: 'alert',
          personName: doc.personId.name,
          personEmail: doc.personId.email,
          docName: doc.docName,
          docNumber: doc.docNumber,
          expiryDate: doc.expiryDate,
          customRecipients: doc.customRecipients,
          sendToPerson: doc.sendToPerson,
          sendToUser: doc.sendToUser
        });

        // Update last reminded timestamp and status
        doc.lastRemindedAt = new Date();
        
        // Also update status based on current date
        if (isExpired) {
          doc.status = 'expired';
        } else {
          doc.status = 'reminding';
        }
        
        await doc.save();
        sentCount++;
      } catch (err) {
        console.error(`❌ Error reminding for ${doc.docName} (${doc.personId.name}):`, err.message);
        failedCount++;
      }
    }

    console.log(`✅ Scan complete. Sent: ${sentCount}, Failed: ${failedCount}`);
    return {
      success: true,
      scanned: expiringDocs.length,
      sent: sentCount,
      failed: failedCount
    };
  } catch (error) {
    console.error('❌ Scheduler Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Initialize the cron scheduler
 */
const initScheduler = () => {
  // Run every day at 09:00 AM
  // Format: second minute hour day-of-month month day-of-week
  // In node-cron: minute hour day-of-month month day-of-week
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Cron job triggered at 9:00 AM');
    await checkAndSendReminders();
  });
  
  console.log('📅 Scheduler Initialized: Daily check scheduled for 9:00 AM.');
};

module.exports = {
  checkAndSendReminders,
  initScheduler
};
