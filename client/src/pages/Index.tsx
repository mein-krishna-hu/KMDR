import React, { useState, useEffect } from 'react';
import { Menu, Bell, UserCircle, Home, Gift, Wallet, MoreHorizontal, Share2, MessageCircle, History, HelpCircle, Info, LogOut, X } from 'lucide-react';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set to false for signed-out version

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
    document.body.style.overflow = 'hidden'; // Disable background scrolling
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    document.body.style.overflow = 'unset'; // Re-enable background scrolling
  };

  const handleSignIn = () => {
    // Handle sign in logic here
    console.log('Sign In clicked');
    closeAuthModal();
  };

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log('Sign Up clicked');
    closeAuthModal();
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
      document.body.style.overflow = 'unset'; // Cleanup on unmount
    };
  }, []);

  // Handle escape key to close modal
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
  
  const rewards = [
    {
      id: 1,
      title: 'Netflix Premium Subscription',
      entryFee: '₹2',
      progress: 65,
      totalUsers: 100,
      currentUsers: 65,
      timeLeft: '2 days',
      type: 'Quiz',
      questions: 15,
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Amazon Prime Membership',
      entryFee: '₹1',
      progress: 42,
      totalUsers: 150,
      currentUsers: 63,
      timeLeft: '3 days',
      type: 'Game',
      highScore: true,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Spotify Premium 3 Months',
      entryFee: '₹2',
      progress: 78,
      totalUsers: 80,
      currentUsers: 62,
      timeLeft: '1 day',
      type: 'Quiz',
      questions: 20,
      image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=400&fit=crop&crop=center'
    }
  ];

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
              <button 
                onClick={openAuthModal}
                className="bg-yellow-300 text-teal-700 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                Start Playing Now
              </button>
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

            {/* Rewards List */}
            <div className="px-4">
              <h2 className="text-white text-xl font-semibold mb-3">Trending Rewards</h2>
              <div className="space-y-4">
                {rewards.map(reward => (
                  <div key={reward.id} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <div className="w-1/3 h-32 overflow-hidden">
                        <img
                          src={reward.image}
                          alt={reward.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800">{reward.title}</h3>
                          <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">
                            {reward.type}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {reward.type === 'Quiz' ? `${reward.questions} questions` : 'High score challenge'}
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{reward.currentUsers}/{reward.totalUsers} players</span>
                            <span>{reward.timeLeft} left</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${reward.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="font-bold text-teal-700">{reward.entryFee}</span>
                          <button 
                            onClick={openAuthModal}
                            className="bg-yellow-300 text-teal-700 text-xs font-bold py-1 px-3 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors"
                          >
                            Play Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Games */}
            <div className="px-4 mt-8">
              <h2 className="text-white text-xl font-semibold mb-3">Featured Games</h2>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={openAuthModal}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-3 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="h-24 bg-yellow-100 rounded-lg mb-2 flex items-center justify-center">
                    <div className="text-4xl text-teal-600">🧠</div>
                  </div>
                  <h3 className="font-medium text-gray-800">General Knowledge</h3>
                  <p className="text-xs text-gray-500 mt-1">15 questions • ₹1 entry</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div 
                  onClick={openAuthModal}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-3 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="h-24 bg-teal-100 rounded-lg mb-2 flex items-center justify-center">
                    <div className="text-4xl text-teal-600">🎮</div>
                  </div>
                  <h3 className="font-medium text-gray-800">Bubble Shooter</h3>
                  <p className="text-xs text-gray-500 mt-1">High score • ₹2 entry</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-600 h-2 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={closeAuthModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🎮</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Join the Fun!</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sign in to start playing games, winning rewards, and earning real prizes
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-teal-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                Sign In
              </button>
              
              <button
                onClick={handleSignUp}
                className="w-full bg-yellow-300 text-teal-700 font-semibold py-3 px-6 rounded-xl hover:bg-yellow-400 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                Sign Up
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Drawer - Only show if authenticated */}
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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">John Smith</h3>
                <p className="text-teal-100 text-sm">Balance: ₹250</p>
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
            <button className="w-full px-6 py-3 flex items-center text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-6 h-6" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Overlay - Only show if authenticated */}
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
          <div className="w-6 h-6"></div> // Placeholder to maintain layout
        )}
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <button className="text-white cursor-pointer mr-4 hover:text-yellow-300 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gray-200 rounded-full cursor-pointer overflow-hidden hover:ring-2 hover:ring-yellow-300 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
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