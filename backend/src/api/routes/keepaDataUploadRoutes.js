const express = require('express');
const keepaDataUploadController = require('../controllers/keepaDataUploadController');
const upload = require('../middleware/fileUploadMiddleware');
const router = express.Router();

/**
 * @swagger
 * /upload-keepa-data:
 *   post:
 *     summary: Upload Keepa data file
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
 *                 description: Keepa CSV file to upload.
 *     responses:
 *       200:
 *         description: File uploaded successfully.
 *       400:
 *         description: No file uploaded.
 *       500:
 *         description: Internal Server Error
 */
router.post(
  '/',
  upload.single('file'),
  keepaDataUploadController.uploadKeepaFile,
);

module.exports = router;
