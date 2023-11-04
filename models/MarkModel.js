const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  term: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  students: [
    {
      student: {
        type: String,
        required: true
      },
      score: {
        type: String,
        required: true
      }
    }
  ]
});

const Mark = mongoose.model('Mark', MarkSchema);

module.exports = Mark;
