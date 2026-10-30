exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });


exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors)[0].message; }
  else if (err.name === 'CastError') { status = 400; message = 'Invalid id.'; }
  else if (err.code === 11000) { status = 400; message = 'That value already exists.'; }
  else if (err.name === 'MulterError') { status = 400; message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (50 MB max).' : err.message; }
  if (status >= 500) { console.error(err); message = 'Server error. Please try again.'; }
  res.status(status).json({ message });
};
