require('dotenv').config({ path: 'backend/.env' });
const { DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const { logAndCollect } = require('../../logs/logger');
const queueURL = process.env.SQS_QUEUE_URL;

/**
 * Creates a DeleteMessageCommand for SQS with error handling and logging.
 * @param {string} receiptHandle - The receipt handle of the message to be deleted.
 * @param {boolean} createLog - Flag to determine whether to create logs.
 * @return {DeleteMessageCommand} A new instance of DeleteMessageCommand.
 */
const deleteMessageCommand = (receiptHandle, createLog = false) => {
  let logMessage = `Creating DeleteMessageCommand for receiptHandle: ${receiptHandle}\n`;
  try {
    const deleteCommand = new DeleteMessageCommand({
      QueueUrl: queueURL,
      ReceiptHandle: receiptHandle,
    });
    return deleteCommand;
  } catch (error) {
    logMessage += `Error creating DeleteMessageCommand: ${error}\n`;
    throw error;
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'DeleteMessageCommand');
    }
  }
};

module.exports = { deleteMessageCommand };
