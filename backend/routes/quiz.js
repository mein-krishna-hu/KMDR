const express = require('express');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all active quizzes
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true, endDate: { $gt: new Date() } };
    
    if (category && category !== 'All') {
      filter.category = category;
    }

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('participants.user', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join quiz
router.post('/:id/join', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.hasEnded) {
      return res.status(400).json({ message: 'Quiz has ended' });
    }

    if (quiz.isFull) {
      return res.status(400).json({ message: 'Quiz is full' });
    }

    if (user.balance < quiz.entryFee) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Check if user already joined
    const alreadyJoined = quiz.participants.some(p => p.user.toString() === user._id.toString());
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this quiz' });
    }

    // Deduct entry fee
    user.balance -= quiz.entryFee;
    await user.save();

    // Add user to participants
    quiz.participants.push({ user: user._id });
    quiz.currentParticipants += 1;
    await quiz.save();

    // Create transaction
    const transaction = new Transaction({
      user: user._id,
      type: 'quiz_entry',
      amount: -quiz.entryFee,
      description: `Entry fee for ${quiz.title}`,
      quiz: quiz._id,
      balanceAfter: user.balance
    });
    await transaction.save();

    res.json({ message: 'Successfully joined quiz', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit quiz answers
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Find participant
    const participantIndex = quiz.participants.findIndex(p => p.user.toString() === user._id.toString());
    if (participantIndex === -1) {
      return res.status(400).json({ message: 'You have not joined this quiz' });
    }

    const participant = quiz.participants[participantIndex];
    if (participant.completedAt) {
      return res.status(400).json({ message: 'Quiz already completed' });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = answers.map((answer, index) => {
      const isCorrect = quiz.questions[index].correctAnswer === answer;
      if (isCorrect) score += 1;
      
      return {
        questionIndex: index,
        selectedAnswer: answer,
        isCorrect
      };
    });

    // Update participant
    participant.score = score;
    participant.completedAt = new Date();
    participant.answers = processedAnswers;

    user.gamesPlayed += 1;
    await user.save();
    await quiz.save();

    res.json({ 
      message: 'Quiz submitted successfully', 
      score,
      totalQuestions: quiz.questions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;