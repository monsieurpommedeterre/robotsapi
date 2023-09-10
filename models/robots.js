const mongoose = require('mongoose');

const robotSchema = mongoose.Schema({
  name: String,
  description: String,
  batteryLevel: Number,
});

const Robot = mongoose.model('robots', robotSchema);

module.exports = Robot;