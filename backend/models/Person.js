const mongoose = require('mongoose');

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    relationship: {
      type: String,
      default: 'Other',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Person', personSchema);
