const fs = require('fs');
const axios = require('axios');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');
const { PassThrough } = require('stream');

/**
 * Downloads and decompresses a document from a given URL.
 * @async
 * @function downloadAndDecompressDocument
 * @param {string} url - The URL of the document to download.
 * @param {string} compressionAlgorithm - The compression algorithm used on the document (e.g., 'GZIP').
 * @param {string} reportType - The type of report being downloaded.
 * @param {string} countryCode - The country code associated with the report.
 * @param {string} dataStartTime - The start date of the data range for the report.
 * @param {string} dataEndTime - The end date of the data range for the report.
 * @param {string} [outputPath='./downloads/'] - The path to save the downloaded document.
 * @description Downloads a document from the specified URL, decompresses it if necessary,
 *              and saves it to the specified directory with a formatted name.
 */
async function downloadAndDecompressDocument(
  url,
  compressionAlgorithm,
  reportType,
  countryCode,
  dataStartTime,
  dataEndTime,
  outputPath = './src/integrations/sp_api/reports_api/downloads/',
) {
  try {
    // Send a GET request to the URL and receive the response as a stream
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });

    // Format the start date to YYYY-MM-DD format for the filename
    const formattedStartDate = new Date(dataStartTime)
      .toISOString()
      .split('T')[0];
    // Format the end date to YYYY-MM-DD format for the filename
    const formattedEndDate = new Date(dataEndTime).toISOString().split('T')[0];
    // Construct the filename using report type, country code, and date
    const fileName = `${reportType}_${countryCode}_${formattedStartDate}_${formattedEndDate}.csv`;
    // Create the full path for the output file
    const outputFilePath = path.join(outputPath, fileName);

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    let decompressionStream;

    // Check the compression algorithm and create the appropriate decompression stream
    switch (compressionAlgorithm) {
      case 'GZIP':
        decompressionStream = zlib.createGunzip();
        break;
      // If no compression or unrecognized, use a pass-through stream
      default:
        decompressionStream = new PassThrough();
    }

    // Use the pipeline function to pipe the data through the decompression stream and into the file
    await pipeline(
      response.data, // The data stream from the axios response
      decompressionStream, // The decompression stream (gunzip or pass-through)
      fs.createWriteStream(outputFilePath), // Write the resulting data to a file
    );

    // Log the successful download and decompression
    console.log(`Document downloaded and decompressed to ${outputFilePath}`);
  } catch (error) {
    // Log any errors encountered during the process
    console.error(`Error downloading or decompressing document: ${error}`);
    throw error;
  }
}

module.exports = { downloadAndDecompressDocument };
