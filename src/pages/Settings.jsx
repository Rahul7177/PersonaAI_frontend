// Settings.jsx
import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FaRobot, FaUserAstronaut, FaPalette } from 'react-icons/fa';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [voiceType, setVoiceType] = useState('ai');
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceChange = (type) => {
    setVoiceType(type);
    if (type === 'human') {
      // Add voice cloning logic here
    }
  };

  const startVoiceCloning = () => {
    setIsRecording(true);
    // Add voice recording logic here
  };

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaPalette className="text-[#ddf43a]" /> Settings
        </h1>

        {/* Theme Settings */}
        <div className="card p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ddf43a] hover:bg-[#c2d42e] transition-colors"
          >
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Voice Settings */}
        <div className="card p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Voice Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleVoiceChange('ai')}
                className={`p-4 rounded-lg flex-1 flex items-center gap-2 ${
                  voiceType === 'ai' ? 'bg-[#ddf43a]' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <FaRobot />
                AI Voice
              </button>
              
              <button
                onClick={() => handleVoiceChange('human')}
                className={`p-4 rounded-lg flex-1 flex items-center gap-2 ${
                  voiceType === 'human' ? 'bg-[#ddf43a]' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <FaUserAstronaut />
                Human Voice
              </button>
            </div>

            {voiceType === 'human' && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Voice Cloning</h3>
                <button
                  onClick={startVoiceCloning}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'bg-[#ddf43a] hover:bg-[#c2d42e]'
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Voice Cloning'}
                </button>
                <p className="text-sm mt-2 opacity-75">
                  {isRecording 
                    ? 'Speaking now - Please read the on-screen prompt...' 
                    : 'Record your voice to create a personalized clone'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;