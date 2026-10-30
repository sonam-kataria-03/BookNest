const Contact = require('../models/Contact');
const Book = require('../models/Book');
const User = require('../models/User');
const Category = require('../models/Category');
const httpError = require('../utils/httpError');

exports.create = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (![name, email, subject, message].every((v) => v?.trim())) throw httpError(400, 'Fill in all the fields.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw httpError(400, 'Enter a valid email.');
  await Contact.create({ name, email, subject, message });
  res.status(201).json({ message: 'Sent' });
};

exports.list = async (req, res) => res.json(await Contact.find().sort({ createdAt: -1 }));

exports.stats = async (req, res) => {
  const [users, books, categories, messages, recentBooks] = await Promise.all([
    User.countDocuments(), Book.countDocuments(), Category.countDocuments(), Contact.countDocuments(),
    Book.find().sort({ createdAt: -1 }).limit(5).populate('category', 'name'),
  ]);
  res.json({ users, books, categories, messages, recentBooks });
};
