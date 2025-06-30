import React, { useState, useEffect } from 'react';
import { Menu, Bell, UserCircle, Home, Gift, Wallet, MoreHorizontal, Share2, MessageCircle, History, HelpCircle, Info, LogOut, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import AuthModal from '../components/AuthModal';
import QuizCard from '../components/QuizCard';

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

const Index: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, [selectedCategory]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getQuizzes(selectedCategory === 'All' ? undefined : selectedCategory);
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar-drawer');
      const menuButton = document.getElementById('menu-button');
      
      if (sidebar && !sidebar.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isAuthModalOpen]);

  const categories = ['All', 'Quiz', 'Games', 'Trending', 'New'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="pb-20">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center pt-16 pb-8">
              <div className="relative w-64 h-64 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&h=500&fit=crop&crop=center"
                  alt="Excited winner"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-yellow-300 text-3xl font-bold tracking-wider mb-4 text-center">PLAY SMALL, WIN BIG</h1>
              <p className="text-white text-center px-6 mb-6">
                Join thousands of players winning premium rewards by playing quick games and answering skill-based questions.
              </p>
              {!isAuthenticated && (
                <button 
                  onClick={openAuthModal}
                  className="bg-yellow-300 text-teal-700 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  Start Playing Now
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="px-4 mb-6">
              <h2 className="text-white text-xl font-semibold mb-3">Categories</h2>
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`py-2 px-4 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? 'bg-yellow-300 text-teal-700 font-medium'
                        : 'bg-teal-600 text-white hover:bg-teal-500'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Quizzes List */}
            <div className="px-4">
              <h2 className="text-white text-xl font-semibold mb-3">Available Quizzes</h2>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map(quiz => (
                    <QuizCard 
                      key={quiz._id} 
                      quiz={quiz} 
                      onJoin={isAuthenticated ? undefined : openAuthModal}
                    />
                  ))}
                  {quizzes.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-white text-lg">No quizzes available in this category</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'rewards':
        return (
          <div className="flex flex-col items-center justify-center h-screen px-4">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-white text-xl text-center mb-2">Rewards Center</p>
            <p className="text-teal-200 text-center">Track your winnings and claim rewards here</p>
          </div>
        );
      case 'deposit':
        return (
          <div className="flex flex-col items-center justify-center h-screen px-4">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-white text-xl text-center mb-2">Add Funds</p>
            <p className="text-teal-200 text-center">Deposit money to participate in games and quizzes</p>
          </div>
        );
      case 'more':
        return (
          <div className="flex flex-col items-center justify-center h-screen px-4">
            <div className="text-6xl mb-4">⚙️</div>
            <p className="text-white text-xl text-center mb-2">More Options</p>
            <p className="text-teal-200 text-center">Settings, help, and additional features</p>
          </div>
        );
      case 'refer':
        return (
          <div className="flex flex-col items-center justify-center h-screen px-4">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-white text-xl text-center mb-2">Refer & Earn</p>
            <p className="text-teal-200 text-center">Invite friends and earn rewards together</p>
            {user && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-gray-700 text-sm mb-2">Your referral code:</p>
                <p className="text-teal-700 font-bold text-lg">{user.referralCode}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-teal-700 min-h-screen relative">
      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal onClose={closeAuthModal} />
      )}

      {/* Sidebar Drawer */}
      {isAuthenticated && (
        <div 
          id="sidebar-drawer"
          className={`fixed top-0 left-0 h-full w-72 bg-white transform transition-transform duration-300 ease-in-out z-30 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 bg-teal-600">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-teal-500">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{user?.name}</h3>
                <p className="text-teal-100 text-sm">Balance: ₹{user?.balance}</p>
              </div>
            </div>
          </div>
          <div className="py-4">
            <button className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-teal-50 transition-colors">
              <UserCircle className="w-6 h-6" />
              <span className="ml-3">Account Settings</span>
            </button>
            <button className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-teal-50 transition-colors">
              <History className="w-6 h-6" />
              <span className="ml-3">Transaction History</span>
            </button>
            <button className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-teal-50 transition-colors">
              <HelpCircle className="w-6 h-6" />
              <span className="ml-3">Help & Support</span>
            </button>
            <button className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-teal-50 transition-colors">
              <Info className="w-6 h-6" />
              <span className="ml-3">About Us</span>
            </button>
            <div className="border-t border-gray-200 mt-4"></div>
            <button 
              onClick={logout}
              className="w-full px-6 py-3 flex items-center text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      {isAuthenticated && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-20 ${
            isSidebarOpen ? 'opacity-50 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-teal-600 py-3 px-4 flex justify-between items-center z-10 shadow-lg">
        {isAuthenticated ? (
          <button id="menu-button" className="text-white cursor-pointer hover:text-yellow-300 transition-colors" onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-6 h-6"></div>
        )}
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <button className="text-white cursor-pointer mr-4 hover:text-yellow-300 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gray-200 rounded-full cursor-pointer overflow-hidden hover:ring-2 hover:ring-yellow-300 transition-all">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-yellow-300 text-teal-700 font-semibold py-2 px-4 rounded-full hover:bg-yellow-400 transition-colors duration-200"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {renderTabContent()}
      </div>

      {/* Bolt Hackathon Badge */}
      <div className="fixed bottom-32 right-4 z-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xs">⚡</span>
            </div>
            <div className="text-xs font-semibold">
              <div className="leading-tight">Built with</div>
              <div className="leading-tight text-yellow-300">Bolt</div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Chatbot Button */}
      <button className="fixed bottom-20 right-4 bg-yellow-300 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer z-10 hover:bg-yellow-400 hover:scale-110 transition-all duration-200">
        <MessageCircle className="w-6 h-6 text-teal-700" />
      </button>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-between items-center px-2 py-2 shadow-lg z-10">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-1/5 py-1 cursor-pointer transition-colors ${
            activeTab === 'home' ? 'text-teal-600' : 'text-gray-500 hover:text-teal-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => isAuthenticated ? setActiveTab('rewards') : openAuthModal()}
          className={`flex flex-col items-center justify-center w-1/5 py-1 cursor-pointer transition-colors ${
            activeTab === 'rewards' ? 'text-teal-600' : 'text-gray-500 hover:text-teal-400'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-xs mt-1">Rewards</span>
        </button>
        <button
          onClick={() => isAuthenticated ? setActiveTab('deposit') : openAuthModal()}
          className={`flex flex-col items-center justify-center w-1/5 py-1 cursor-pointer transition-colors ${
            activeTab === 'deposit' ? 'text-teal-600' : 'text-gray-500 hover:text-teal-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-xs mt-1">Deposit</span>
        </button>
        <button
          onClick={() => isAuthenticated ? setActiveTab('more') : openAuthModal()}
          className={`flex flex-col items-center justify-center w-1/5 py-1 cursor-pointer transition-colors ${
            activeTab === 'more' ? 'text-teal-600' : 'text-gray-500 hover:text-teal-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-xs mt-1">More</span>
        </button>
        <button
          onClick={() => isAuthenticated ? setActiveTab('refer') : openAuthModal()}
          className={`flex flex-col items-center justify-center w-1/5 py-1 cursor-pointer transition-colors ${
            activeTab === 'refer' ? 'text-teal-600' : 'text-gray-500 hover:text-teal-400'
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-xs mt-1">Refer</span>
        </button>
      </div>
    </div>
  );
};

export default Index;