const {
  processKeepaDataFile,
} = require('../services/keepaDataProcessingService');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// Function to handle the upload and processing of Keepa data files
exports.uploadKeepaFile = async (req, res) => {
  if (!req.file) {
    return sendErrorResponse(res, new Error('No file uploaded'), 400);
  }

  try {
    // Process the uploaded file
    const processResult = await processKeepaDataFile(req.file.path);
    // If processing is successful, return a detailed response
    res.status(200).send({
      message: 'Keepa data file processed successfully',
      results: processResult.results,
      processed: processResult.processed,
      missingProductCategories: processResult.missingProductCategories,
      successful: processResult.successful,
      duplicates: processResult.duplicates,
      errors: processResult.errors,
    });
  } catch (error) {
    // Handle any errors during the processing
    sendErrorResponse(res, error);
  }
};
