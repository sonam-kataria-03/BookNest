const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Book',
  new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      author: { type: String, required: true, trim: true },
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
      description: { type: String, default: '' },
      coverImage: { type: String, default: '' },
      bookFile: { type: String, default: '' },
      publishedYear: { type: Number },
      status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
