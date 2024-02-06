const { PassThrough } = require('stream');
const zlib = require('zlib');
const { logger } = require('../../utils/logger');

/**
 * Chooses the appropriate decompression stream based on the compression algorithm.
 *
 * @param {string|null} compressionAlgorithm - The compression algorithm used.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {stream.Transform} The decompression stream.
 */
function chooseDecompressionStream(
  compressionAlgorithm,
  createLog,
  logContext,
) {
  switch (compressionAlgorithm) {
    case 'GZIP':
      if (createLog) {
        logger('Using GZIP decompression stream\n', logContext);
      }
      return zlib.createGunzip();
    case null:
    case undefined:
      if (createLog) {
        logger('Using PassThrough decompression stream\n', logContext);
      }
      return new PassThrough();
    default:
      if (createLog) {
        logger(
          `Unsupported compression algorithm: ${compressionAlgorithm}\n`,
          logContext,
        );
      }
      throw new Error(
        `Unsupported compression algorithm: ${compressionAlgorithm}`,
      );
  }
}
module.exports = {
  chooseDecompressionStream,
};
