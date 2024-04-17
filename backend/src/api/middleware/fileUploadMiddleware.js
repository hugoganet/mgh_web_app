const multer = require('multer');
const path = require('path');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// Multer setup to handle file storage
const upload = multer({ storage: storage });

module.exports = upload;
