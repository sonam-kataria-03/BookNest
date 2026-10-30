const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Contact',
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      subject: { type: String, required: true, trim: true },
      message: { type: String, required: true, trim: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
