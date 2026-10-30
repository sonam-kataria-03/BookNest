const fs = require('fs');
const path = require('path');

// Deletes an uploaded file given its stored path (e.g. /uploads/abc.pdf). Ignores anything outside /uploads.
exports.removeFile = (p) => {
  if (!p || !p.startsWith('/uploads/')) return;
  const full = path.join(__dirname, '..', 'uploads', path.basename(p));
  fs.unlink(full, () => {});
};

exports.escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
