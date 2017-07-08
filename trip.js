const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    trim: true
  },
  endDate: {
    type: String,
    trim: true
  },
  cities: [
    {
      city: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      },
      startDate: {
        type: String,
        trim: true
      },
      endDate: {
        type: String,
        trim: true
      }
    }
  ],
  locations: [
    {
      name: {
        type: String,
        trim: true
      },
      type: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      date: {
        type: String,
        trim: true
      },
      startTime: {
        type: String,
        trim: true
      },
      endTime: {
        type: String,
        trim: true
      }
    }
  ]
});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;
