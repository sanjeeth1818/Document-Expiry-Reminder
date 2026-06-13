const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: [true, 'Please associate this document with a person'],
    },
    docName: {
      type: String,
      required: [true, 'Please add a document name (e.g., NIC, Driving License)'],
      trim: true,
    },
    docNumber: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please specify the expiry date'],
    },
    reminderStartDate: {
      type: Date,
      required: [true, 'Please specify the reminder start date'],
    },
    status: {
      type: String,
      enum: ['active', 'reminding', 'expired', 'muted'],
      default: 'active',
    },
    sendToPerson: {
      type: Boolean,
      default: true,
    },
    sendToUser: {
      type: Boolean,
      default: true,
    },
    customRecipients: [
      {
        type: String,
        trim: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },
    ],
    lastRemindedAt: {
      type: Date,
      default: null,
    },
    isMuted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to automatically calculate the status based on dates
documentSchema.pre('save', function (next) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(this.expiryDate);
  expiry.setHours(0, 0, 0, 0);

  if (this.isMuted) {
    this.status = 'muted';
  } else if (today > expiry) {
    this.status = 'expired';
  } else {
    const reminderStart = new Date(this.reminderStartDate);
    reminderStart.setHours(0, 0, 0, 0);
    
    if (today >= reminderStart) {
      this.status = 'reminding';
    } else {
      this.status = 'active';
    }
  }
  next();
});

module.exports = mongoose.model('Document', documentSchema);
