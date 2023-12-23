const { PassThrough } = require('stream');
const zlib = require('zlib');

/**
 * Chooses the appropriate decompression stream based on the compression algorithm.
 *
 * @param {string|null} compressionAlgorithm - The compression algorithm used.
 * @return {stream.Transform} The decompression stream.
 */
function chooseDecompressionStream(compressionAlgorithm) {
  switch (compressionAlgorithm) {
    case 'GZIP':
      return zlib.createGunzip();
    case null:
    case undefined:
      return new PassThrough();
    default:
      throw new Error(
        `Unsupported compression algorithm: ${compressionAlgorithm}`,
      );
  }
}
module.exports = {
  chooseDecompressionStream,
};
