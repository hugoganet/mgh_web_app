require('dotenv').config({ path: 'backend/.env' });
const { logger } = require('../../../utils/logger.js');
const { sqsClient } = require('./aws_sqs_queue/sqsClient.js');
const { receiveMessage } = require('./aws_sqs_queue/receiveMessageCommand.js');
const {
  deleteMessageCommand,
} = require('./aws_sqs_queue/deleteMessageCommand.js');
const {
  processReportProcessingFinishedNotification,
} = require('./processReportProcessingFinishedNotifications.js');

/**
 * @async
 * @function receiveAndProcessNotifications
 * @param {function} createLog - The logger function
 * @param {string} logContext - The context for the log
 * @description Receives and processes notifications from the SQS queue
 * @return {Promise}
 */
async function receiveAndProcessNotifications(
  createLog = false,
  logContext = 'receiveAndProcessNotifications',
) {
  let logMessage = '';
  let data;
  try {
    data = await sqsClient.send(receiveMessage);

    if (!data) {
      console.error(
        'Error receiving SQS messages in receiveAndProcessNotifications',
      );
      logMessage += `Error receiving SQS messages: ${error}\n`;
      return; // Exit the function early if unable to receive messages
    } else if (data.Messages && data.Messages.length > 0) {
      for (const message of data.Messages) {
        const notification = JSON.parse(message.Body);
        const notificationType =
          notification.notificationType || notification.NotificationType;

        if (notificationType === 'REPORT_PROCESSING_FINISHED') {
          await processReportProcessingFinishedNotification(
            message,
            true,
            logContext,
          );
        }

        if (notificationType === 'ANY_OFFER_CHANGED') {
          const notificationId =
            notification.NotificationMetadata.NotificationId;
          try {
            const deleteMessage = deleteMessageCommand(
              message.ReceiptHandle,
              false,
            );
            await sqsClient.send(deleteMessage);
            logMessage += `Deleted ${notificationId} notification of type ${notificationType} and ReceiptHandle ${message.ReceiptHandle} from queue\n`;
          } catch (error) {
            logMessage += `Error deleting ${notificationId} notification of type ${notificationType} from queue : ${error}\n DeleteMessageCommand response: ${JSON.stringify(
              deleteResponse,
              null,
              2,
            )}\n`;
          }
        }
      }
    } else {
      logMessage += 'No SQS messages received.\n';
    }
  } catch (error) {
    console.error('Error receiving and processing notifications:', error);
    logMessage += `Error receiving and processing notifications: ${error}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext, 1, true);
    }
  }
}

receiveAndProcessNotifications(true);
