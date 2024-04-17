const express = require('express');
const catalogUploadController = require('../controllers/catalogUploadController');
const upload = require('../middleware/fileUploadMiddleware');
const router = express.Router();

/**
 * @swagger
 * /uploadCatalog:
 *   post:
 *     summary: Upload supplier catalog file
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
 *                 description: Supplier catalog file to upload.
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
  catalogUploadController.uploadCatalogFile,
);

module.exports = router;
