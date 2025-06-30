import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  entryFee: number;
  prizeAmount: number;
  maxParticipants: number;
  currentParticipants: number;
  questions: any[];
  timeLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: string;
  progress: number;
}

interface QuizCardProps {
  quiz: Quiz;
  onJoin?: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onJoin }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePlayNow = () => {
    if (isAuthenticated) {
      navigate(`/quiz/${quiz._id}`);
    } else if (onJoin) {
      onJoin();
    }
  };

  const timeLeft = () => {
    const now = new Date();
    const endDate = new Date(quiz.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return `${diffDays} days left`;
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return diffHours > 0 ? `${diffHours} hours left` : 'Ending soon';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="w-1/3 h-32 overflow-hidden">
          <img
            src={quiz.image || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop&crop=center'}
            alt={quiz.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800 text-sm">{quiz.title}</h3>
            <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">
              {quiz.category}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {quiz.questions.length} questions • {quiz.timeLimit} minutes
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{quiz.currentParticipants}/{quiz.maxParticipants} players</span>
              <span>{timeLeft()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${quiz.progress || (quiz.currentParticipants / quiz.maxParticipants) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-600">
              <span className="font-bold text-teal-700">₹{quiz.entryFee}</span> entry
              <span className="ml-2 text-green-600">Win ₹{quiz.prizeAmount}</span>
            </div>
            <button 
              onClick={handlePlayNow}
              className="bg-yellow-300 text-teal-700 text-xs font-bold py-1 px-3 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors"
            >
              Play Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;