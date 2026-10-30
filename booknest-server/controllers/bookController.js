const Book = require('../models/Book');
const Category = require('../models/Category');
const SavedBook = require('../models/SavedBook');
const httpError = require('../utils/httpError');
const { removeFile, escapeRegex } = require('../utils/files');

const filesOf = (req) => ({
  coverImage: req.files?.coverImage?.[0] && `/uploads/${req.files.coverImage[0].filename}`,
  bookFile: req.files?.bookFile?.[0] && `/uploads/${req.files.bookFile[0].filename}`,
});
const cleanupNew = (req) => Object.values(filesOf(req)).forEach(removeFile);

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAdmin = async (req) => {
  const header = req.headers?.authorization || '';
  if (!header.startsWith('Bearer ')) return false;
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    return Boolean(user && user.role === 'admin' && user.status === 'Active');
  } catch {
    return false;
  }
};

exports.list = async (req, res) => {
  const { search, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(escapeRegex(String(search)), 'i');
    filter.$or = [{ title: rx }, { author: rx }];
  }
  const books = await Book.find(filter).populate('category', 'name').sort({ createdAt: -1 });
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) {
    return res.json(
      books.map((b) => {
        if (b.status === 'Unavailable') {
          const obj = b.toObject();
          obj.bookFile = '';
          return obj;
        }
        return b;
      })
    );
  }
  res.json(books);
};

exports.get = async (req, res) => {
  const book = await Book.findById(req.params.id).populate('category', 'name');
  if (!book) throw httpError(404, 'Book not found.');
  if (book.status === 'Unavailable') {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      const obj = book.toObject();
      obj.bookFile = '';
      return res.json(obj);
    }
  }
  res.json(book);
};

exports.create = async (req, res) => {
  try {
    const { title, author, category, description, publishedYear, status } = req.body;
    if (!(await Category.exists({ _id: category }))) throw httpError(400, 'Choose a valid category.');
    const f = filesOf(req);
    const book = await Book.create({
      title, author, category, description, status,
      publishedYear: publishedYear || undefined,
      coverImage: f.coverImage || '', bookFile: f.bookFile || '',
    });
    res.status(201).json(await book.populate('category', 'name'));
  } catch (e) { cleanupNew(req); throw e; }
};

exports.update = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw httpError(404, 'Book not found.');
    const { title, author, category, description, publishedYear, status } = req.body;
    if (category && !(await Category.exists({ _id: category }))) throw httpError(400, 'Choose a valid category.');
    Object.assign(book, { title, author, description, status });
    if (category) book.category = category;
    book.publishedYear = publishedYear || undefined;
    const f = filesOf(req);
    if (f.coverImage) { removeFile(book.coverImage); book.coverImage = f.coverImage; }
    if (f.bookFile) { removeFile(book.bookFile); book.bookFile = f.bookFile; }
    await book.save();
    res.json(await book.populate('category', 'name'));
  } catch (e) { cleanupNew(req); throw e; }
};

exports.remove = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) throw httpError(404, 'Book not found.');
  removeFile(book.coverImage);
  removeFile(book.bookFile);
  await SavedBook.deleteMany({ book: book._id });
  res.json({ message: 'Deleted' });
};
