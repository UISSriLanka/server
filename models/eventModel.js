const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  allDay: Boolean,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
