const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const httpError = require('../utils/httpError');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase()),
});

const fileFilter = (req, file, cb) => {
  const isImage = ['coverImage', 'profileImage'].includes(file.fieldname);
  const ok = isImage ? /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype) : file.mimetype === 'application/pdf';
  cb(ok ? null : httpError(400, isImage ? 'Images must be JPG, PNG, WEBP or GIF.' : 'Book files must be PDF.'), ok);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });
