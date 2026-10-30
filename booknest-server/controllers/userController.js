const User = require('../models/User');
const SavedBook = require('../models/SavedBook');
const httpError = require('../utils/httpError');
const { removeFile } = require('../utils/files');

exports.list = async (req, res) => res.json(await User.find().sort({ createdAt: -1 }));


exports.update = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  if (!isAdmin && req.user._id.toString() !== req.params.id) throw httpError(403, 'Not allowed.');
  try {
    const target = await User.findById(req.params.id);
    if (!target) throw httpError(404, 'User not found.');
    if (req.body.name?.trim()) target.name = req.body.name;
    if (isAdmin && ['Active', 'Inactive'].includes(req.body.status)) {
      if (target._id.equals(req.user._id) && req.body.status === 'Inactive') throw httpError(400, 'You cannot deactivate your own account.');
      target.status = req.body.status;
    }
    if (req.file) { removeFile(target.profileImage); target.profileImage = `/uploads/${req.file.filename}`; }
    res.json(await target.save());
  } catch (e) { if (req.file) removeFile(`/uploads/${req.file.filename}`); throw e; }
};


exports.savedList = async (req, res) => {
  const rows = await SavedBook.find({ user: req.user._id }).sort({ createdAt: -1 }).populate({ path: 'book', populate: { path: 'category', select: 'name' } });
  res.json(rows.map((r) => r.book).filter(Boolean));
};
exports.savedAdd = async (req, res) => {
  await SavedBook.updateOne({ user: req.user._id, book: req.params.bookId }, { $setOnInsert: { user: req.user._id, book: req.params.bookId } }, { upsert: true });
  res.status(201).json({ message: 'Saved' });
};
exports.savedRemove = async (req, res) => {
  await SavedBook.deleteOne({ user: req.user._id, book: req.params.bookId });
  res.json({ message: 'Removed' });
};
