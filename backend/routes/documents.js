const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Person = require('../models/Person');
const { checkAndSendReminders } = require('../services/scheduler');
const { sendEmailNotification } = require('../services/emailService');

// Helper to extract email params from a populated doc
const emailParams = (doc) => ({
  personName: doc.personId.name,
  personEmail: doc.personId.email,
  docName: doc.docName,
  docNumber: doc.docNumber,
  expiryDate: doc.expiryDate,
  customRecipients: doc.customRecipients,
  sendToPerson: doc.sendToPerson,
  sendToUser: doc.sendToUser
});

// @route   GET /api/documents
router.get('/', async (req, res) => {
  try {
    const { personId } = req.query;
    const filter = personId ? { personId } : {};
    const documents = await Document.find(filter).populate('personId').sort({ expiryDate: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/documents - Create a new document tracker
router.post('/', async (req, res) => {
  const { personId, docName, docNumber, expiryDate, reminderStartDate, sendToPerson, sendToUser, customRecipients } = req.body;

  if (!personId || !docName || !expiryDate || !reminderStartDate) {
    return res.status(400).json({ message: 'Please provide personId, docName, expiryDate, and reminderStartDate' });
  }

  try {
    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    const newDoc = new Document({
      personId, docName, docNumber, expiryDate, reminderStartDate,
      sendToPerson: sendToPerson !== undefined ? sendToPerson : true,
      sendToUser: sendToUser !== undefined ? sendToUser : true,
      customRecipients: customRecipients || []
    });

    const savedDoc = await newDoc.save();
    const populatedDoc = await Document.findById(savedDoc._id).populate('personId');

    // Send "Added" notification email
    sendEmailNotification({ eventType: 'added', ...emailParams(populatedDoc) }).catch(console.error);

    res.status(201).json(populatedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/documents/:id - Update a document
router.put('/:id', async (req, res) => {
  const { docName, docNumber, expiryDate, reminderStartDate, sendToPerson, sendToUser, customRecipients, isMuted } = req.body;

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (docName !== undefined) doc.docName = docName;
    if (docNumber !== undefined) doc.docNumber = docNumber;
    if (expiryDate !== undefined) doc.expiryDate = expiryDate;
    if (reminderStartDate !== undefined) doc.reminderStartDate = reminderStartDate;
    if (sendToPerson !== undefined) doc.sendToPerson = sendToPerson;
    if (sendToUser !== undefined) doc.sendToUser = sendToUser;
    if (customRecipients !== undefined) doc.customRecipients = customRecipients;
    if (isMuted !== undefined) doc.isMuted = isMuted;

    const updatedDoc = await doc.save();
    const populatedDoc = await Document.findById(updatedDoc._id).populate('personId');
    res.json(populatedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PATCH /api/documents/:id/mute - Mute or unmute reminders
router.patch('/:id/mute', async (req, res) => {
  const { isMuted } = req.body;
  if (isMuted === undefined) return res.status(400).json({ message: 'Please specify isMuted (true/false)' });

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.isMuted = isMuted;
    const savedDoc = await doc.save();
    const populatedDoc = await Document.findById(savedDoc._id).populate('personId');

    // Send mute/unmute notification email
    const eventType = isMuted ? 'muted' : 'unmuted';
    sendEmailNotification({ eventType, ...emailParams(populatedDoc) }).catch(console.error);

    res.json(populatedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PATCH /api/documents/:id/renew - Renew document with new dates
router.patch('/:id/renew', async (req, res) => {
  const { expiryDate, reminderStartDate } = req.body;
  if (!expiryDate || !reminderStartDate) {
    return res.status(400).json({ message: 'Please provide new expiryDate and reminderStartDate' });
  }

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.expiryDate = expiryDate;
    doc.reminderStartDate = reminderStartDate;
    doc.isMuted = false;
    doc.lastRemindedAt = null;

    const savedDoc = await doc.save();
    const populatedDoc = await Document.findById(savedDoc._id).populate('personId');

    // Send "Renewed" notification email
    sendEmailNotification({ eventType: 'renewed', ...emailParams(populatedDoc) }).catch(console.error);

    res.json(populatedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/documents/:id - Delete document tracker
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate('personId');
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Send "Deleted" notification email BEFORE deleting so we still have doc data
    if (doc.personId) {
      sendEmailNotification({ eventType: 'deleted', ...emailParams(doc) }).catch(console.error);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document tracker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/trigger-reminders - Called by Vercel Cron (Vercel always uses GET)
// @route   POST /api/documents/trigger-reminders - Called manually from frontend button
const handleTriggerReminders = async (req, res) => {
  try {
    const result = await checkAndSendReminders();
    res.json({ message: 'Scan run completed successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get('/trigger-reminders', handleTriggerReminders);  // Vercel Cron uses GET
router.post('/trigger-reminders', handleTriggerReminders); // Frontend manual trigger uses POST

// @route   POST /api/documents/:id/send-manual-email - Manual immediate alert email
router.post('/:id/send-manual-email', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate('personId');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!doc.personId) return res.status(400).json({ message: 'Document has no associated person details' });

    const emailInfo = await sendEmailNotification({ eventType: 'alert', ...emailParams(doc) });

    res.json({ message: 'Reminder email sent successfully', messageId: emailInfo?.messageId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
