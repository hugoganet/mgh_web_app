require('dotenv').config({ path: 'backend/.env' });
const { ReceiveMessageCommand } = require('@aws-sdk/client-sqs');
const queueURL = process.env.SQS_QUEUE_URL;

const receiveMessage = new ReceiveMessageCommand({
  QueueUrl: queueURL,
  MaxNumberOfMessages: 10,
  WaitTimeSeconds: 20,
  VisibilityTimeout: 5, // time in second before the message is visible again in the queue
  MessageRetentionPeriod: 1209600,
});

module.exports = { receiveMessage };
