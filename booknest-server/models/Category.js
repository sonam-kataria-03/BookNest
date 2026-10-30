const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Category',
  new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true, trim: true },
      description: { type: String, default: '', trim: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
