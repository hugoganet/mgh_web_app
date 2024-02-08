const EventEmitter = require('events');

/**
 * @class EventBus
 * @description A simple event bus that extends EventEmitter.
 */
class EventBus extends EventEmitter {}

// Create a single instance of EventBus
const eventBus = new EventBus();

// Configure the max listeners to avoid memory leak warnings
eventBus.setMaxListeners(100);

module.exports = eventBus;
