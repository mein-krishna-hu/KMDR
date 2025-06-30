import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Wallet, Trophy, GamepadIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    navigate('/');
    return null;
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
        <h1 className="text-white text-lg font-semibold">Profile</h1>
      </div>

      <div className="px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-teal-100">
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <div className="mt-4 p-3 bg-teal-50 rounded-lg">
            <p className="text-sm text-gray-600">Referral Code</p>
            <p className="text-lg font-bold text-teal-600">{user.referralCode}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center">
            <Wallet className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-xl font-bold text-gray-800">₹{user.balance}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Winnings</p>
            <p className="text-xl font-bold text-gray-800">₹{user.totalWinnings}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <GamepadIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Games Played</p>
            <p className="text-xl font-bold text-gray-800">{user.gamesPlayed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <User className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Win Rate</p>
            <p className="text-xl font-bold text-gray-800">
              {user.gamesPlayed > 0 ? Math.round((user.totalWinnings / (user.gamesPlayed * 10)) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button className="w-full bg-white text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Edit Profile
          </button>
          <button className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
            Add Funds
          </button>
          <button className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Transaction History
          </button>
          <button 
            onClick={logout}
            className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;