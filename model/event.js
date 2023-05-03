const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
      name: {type:String, required: true},
      description: {type:String, required: true},
      date: {type:Date, required: true},
      location: {type:String, required: true},
    },
    {
      timestamps: true,
    },
);

module.exports = mongoose.model('event', eventSchema);