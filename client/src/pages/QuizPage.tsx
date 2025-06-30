import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  entryFee: number;
  prizeAmount: number;
  maxParticipants: number;
  currentParticipants: number;
  questions: Question[];
  timeLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
}

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const data = await apiService.getQuiz(id!);
      setQuiz(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQuiz = async () => {
    if (!isAuthenticated || !quiz) return;

    try {
      setLoading(true);
      await apiService.joinQuiz(quiz._id);
      setHasJoined(true);
      // Update user balance
      if (user) {
        updateUser({ balance: user.balance - quiz.entryFee });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (!quiz) return;
    setIsPlaying(true);
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    setAnswers(new Array(quiz.questions.length).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      setLoading(true);
      const result = await apiService.submitQuiz(quiz._id, answers);
      setScore(result.score);
      setQuizCompleted(true);
      setIsPlaying(false);
      
      // Update user stats
      if (user) {
        updateUser({ 
          gamesPlayed: user.gamesPlayed + 1,
          // Add winnings if user won
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-teal-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-teal-700 flex items-center justify-center">
        <div className="text-white text-xl">Quiz not found</div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-teal-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 mb-4">
            You scored {score} out of {quiz.questions.length} questions correctly.
          </p>
          <div className="text-lg font-semibold text-teal-600 mb-6">
            Score: {Math.round((score / quiz.questions.length) * 100)}%
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isPlaying) {
    const question = quiz.questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-teal-700 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Clock className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-lg">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    answers[currentQuestion] === index
                      ? 'border-teal-600 bg-teal-50 text-teal-800'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === -1}
              className="bg-yellow-300 text-teal-700 font-bold py-3 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-700">
      {/* Header */}
      <div className="bg-teal-600 px-4 py-4 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-yellow-300 transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-semibold">Quiz Details</h1>
      </div>

      <div className="px-4 py-6">
        {/* Quiz Image */}
        <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
          <img
            src={quiz.image || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=400&fit=crop&crop=center'}
            alt={quiz.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quiz Info */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
            <span className="bg-teal-600 text-white text-sm px-3 py-1 rounded-full">
              {quiz.category}
            </span>
          </div>
          
          <p className="text-gray-600 mb-6">{quiz.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-teal-600" />
              <span className="text-sm text-gray-600">
                {quiz.currentParticipants}/{quiz.maxParticipants} players
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span className="text-sm text-gray-600">{quiz.timeLimit} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-teal-600" />
              <span className="text-sm text-gray-600">₹{quiz.prizeAmount} prize</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {quiz.questions.length} questions
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-800">Entry Fee</span>
              <span className="text-2xl font-bold text-teal-600">₹{quiz.entryFee}</span>
            </div>
            <div className="text-sm text-gray-600">
              Current balance: ₹{user?.balance}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!hasJoined ? (
            <button
              onClick={handleJoinQuiz}
              disabled={loading || (user?.balance || 0) < quiz.entryFee}
              className="w-full bg-yellow-300 text-teal-700 font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
            >
              {loading ? 'Joining...' : `Join Quiz - ₹${quiz.entryFee}`}
            </button>
          ) : (
            <button
              onClick={startQuiz}
              className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Start Quiz
            </button>
          )}
          
          {(user?.balance || 0) < quiz.entryFee && !hasJoined && (
            <div className="text-center text-red-500 text-sm">
              Insufficient balance. Please add funds to join this quiz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;