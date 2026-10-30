const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const auth = require('../controllers/authController');
const books = require('../controllers/bookController');
const cats = require('../controllers/categoryController');
const users = require('../controllers/userController');
const contact = require('../controllers/contactController');

const bookFiles = upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'bookFile', maxCount: 1 }]);

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/auth/forgot-password', auth.forgotPassword);
router.post('/auth/verify-otp', auth.verifyOtp);
router.post('/auth/reset-password', auth.resetPassword);
router.get('/auth/profile', protect, auth.profile);

router.get('/books', books.list);
router.get('/books/:id', books.get);
router.post('/books', protect, adminOnly, bookFiles, books.create);
router.put('/books/:id', protect, adminOnly, bookFiles, books.update);
router.delete('/books/:id', protect, adminOnly, books.remove);

router.get('/categories', cats.list);
router.post('/categories', protect, adminOnly, cats.create);
router.put('/categories/:id', protect, adminOnly, cats.update);
router.delete('/categories/:id', protect, adminOnly, cats.remove);

router.get('/users', protect, adminOnly, users.list);
router.put('/users/:id', protect, upload.single('profileImage'), users.update);

router.get('/saved', protect, users.savedList);
router.post('/saved/:bookId', protect, users.savedAdd);
router.delete('/saved/:bookId', protect, users.savedRemove);

router.post('/contact', contact.create);
router.get('/contact', protect, adminOnly, contact.list);
router.get('/stats', protect, adminOnly, contact.stats);

module.exports = router;
