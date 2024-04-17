const express = require('express');
const multer = require('multer');
const path = require('path');
const fileUploadController = require('../controllers/fileUploadController');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    FileUpload:
 *      type: object
 *      required:
 *        - file
 *      properties:
 *        file:
 *          type: string
 *          format: binary
 *          description: File to be uploaded.
 * tags:
 *  name: File Upload
 *  description: API for uploading files
 */

// Set up storage options with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder to store the files
  },
  filename: function (req, file, cb) {
    // Create a unique filename with the original extension preserved
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a CSV file
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file to upload.
 *     responses:
 *       200:
 *         description: File uploaded and processed successfully.
 *       400:
 *         description: No file uploaded or error in file format.
 *       500:
 *         description: Server error or error during processing.
 */
router.post(
  '/upload',
  upload.single('file'),
  fileUploadController.uploadCsvFile,
);

module.exports = router;
