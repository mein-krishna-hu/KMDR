const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Quiz', 'Games', 'Trending', 'New']
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0
  },
  prizeAmount: {
    type: Number,
    required: true,
    min: 0
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 15
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      default: 0
    },
    completedAt: {
      type: Date
    },
    answers: [{
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean
    }]
  }],
  winners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    position: Number,
    prizeWon: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate progress percentage
quizSchema.virtual('progress').get(function() {
  return Math.round((this.currentParticipants / this.maxParticipants) * 100);
});

// Check if quiz is full
quizSchema.virtual('isFull').get(function() {
  return this.currentParticipants >= this.maxParticipants;
});

// Check if quiz has ended
quizSchema.virtual('hasEnded').get(function() {
  return new Date() > this.endDate;
});

// Ensure virtuals are included in JSON
quizSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Quiz', quizSchema);