const catalogProcessingService = require('../services/catalogProcessingService');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// Function to handle the upload and processing of supplier catalog files
exports.uploadCatalogFile = async (req, res) => {
  if (!req.file) {
    return sendErrorResponse(res, new Error('No file uploaded'), 400);
  }

  try {
    // Process the uploaded file
    const { message, errors } =
      await catalogProcessingService.processCatalogFile(req.file.path);
    if (errors.length > 0) {
      // If there are any processing errors, send them along with a partial success status
      res.status(202).send({
        message,
        errors,
        note: 'Some entries could not be processed due to errors listed.',
      });
    } else {
      // If all entries were processed successfully without errors
      res.status(200).send({ message });
    }
  } catch (error) {
    // Handle unexpected errors in processing
    sendErrorResponse(res, error);
  }
};
