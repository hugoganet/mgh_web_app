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

    // Usage in downloadAndDecompressDocument
    const fileName = formatFileName(
      reportType,
      countryCode,
      dataStartTime,
      dataEndTime,
    );

    console.log('outputPath:', outputPath);
    console.log('fileName:', fileName);
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
      case null:
      case undefined:
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

/**
 * @param {*} reportType
 * @param {*} countryCode
 * @param {*} startDate
 * @param {*} endDate
 * @return {string} fileName
 */
function formatFileName(reportType, countryCode, startDate, endDate) {
  const formatDate = date =>
    date ? new Date(date).toISOString().split('T')[0] : '';

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  let fileName = `${reportType}_${countryCode}`;
  if (formattedStartDate) fileName += `_${formattedStartDate}`;
  if (formattedEndDate) fileName += `_${formattedEndDate}`;
  fileName += '.csv';

  return fileName;
}

module.exports = { downloadAndDecompressDocument };
