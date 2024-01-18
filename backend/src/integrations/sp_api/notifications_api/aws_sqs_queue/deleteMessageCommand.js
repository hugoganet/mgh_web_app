const { DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const queueURL = process.env.SQS_QUEUE_URL;

const deleteMessageCommand = receiptHandle => {
  return new DeleteMessageCommand({
    QueueUrl: queueURL,
    ReceiptHandle: receiptHandle,
  });
};

module.exports = { deleteMessageCommand };
