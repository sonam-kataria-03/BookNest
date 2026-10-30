const Category = require('../models/Category');
const Book = require('../models/Book');
const httpError = require('../utils/httpError');

exports.list = async (req, res) => res.json(await Category.find().sort({ name: 1 }));

exports.create = async (req, res) => {
  if (!req.body.name?.trim()) throw httpError(400, 'Category name is required.');
  res.status(201).json(await Category.create({ name: req.body.name, description: req.body.description }));
};

exports.update = async (req, res) => {
  const c = await Category.findById(req.params.id);
  if (!c) throw httpError(404, 'Category not found.');
  if (req.body.name?.trim()) c.name = req.body.name;
  if (req.body.description !== undefined) c.description = req.body.description;
  res.json(await c.save());
};

exports.remove = async (req, res) => {
  const used = await Book.countDocuments({ category: req.params.id });
  if (used) throw httpError(400, `${used} book(s) use this category. Move or delete them first.`);
  const c = await Category.findByIdAndDelete(req.params.id);
  if (!c) throw httpError(404, 'Category not found.');
  res.json({ message: 'Deleted' });
};
