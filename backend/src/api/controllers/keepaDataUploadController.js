const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// Simplified Keepa data upload function
exports.uploadKeepaFile = async (req, res) => {
  if (!req.file) {
    return sendErrorResponse(res, new Error('No file uploaded'), 400);
  }

  // At this point, the file is already saved in the uploads/ directory by Multer
  res.status(200).send({ message: 'Keepa data file uploaded successfully' });
};
