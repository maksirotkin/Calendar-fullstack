const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  day: Number ,
  month: Number,
  year: Number,
  events:[{
    title: String,
    time: String
  }],
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const dayEvents = mongoose.model('dayEvents', eventsSchema);

module.exports = dayEvents;



