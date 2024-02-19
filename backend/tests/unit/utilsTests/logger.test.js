const { logger, flushLogBuffer } = require('../../../src/utils/logger');
const fs = require('fs');

// Mock fs.appendFileSync to prevent actual file writes and to capture calls for inspection
jest.mock('fs', () => ({
  appendFileSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true), // Mock existsSync to always return true
  mkdirSync: jest.fn(), // Mock mkdirSync as well, but no need to track calls
}));

describe('Logger with nested function calls', () => {
  beforeEach(() => {
    // Clear all mock implementations and data
    fs.appendFileSync.mockClear();
    fs.existsSync.mockClear();
    fs.mkdirSync.mockClear();
  });

  test('Log messages are ordered according to nesting level', () => {
    // Simulate nested function calls with logging
    logger('Starting top-level operation', 'test', '1');
    logger('Entering first nested function', 'test', '1.1');
    logger('Second level nesting', 'test', '1.1.1');
    logger('Third level nesting', 'test', '1.1.1.1');

    // Manually trigger the log buffer flush to process and sort the log entries
    if (flushLogBuffer) {
      flushLogBuffer();
    }

    // Check that fs.appendFileSync was called the expected number of times
    expect(fs.appendFileSync).toHaveBeenCalledTimes(4);

    // After flushing the log buffer in your test
    const callOrder = fs.appendFileSync.mock.calls.map(call => {
      const logMessage = call[1];
      const match = logMessage.match(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\]\s(?:\[(.*?)\])?\s/,
      );
      return match ? match[1] : '';
    });

    const expectedOrder = ['1', '1.1', '1.1.1', '1.1.1.1'];
    expect(callOrder).toEqual(expectedOrder);
  });
});
