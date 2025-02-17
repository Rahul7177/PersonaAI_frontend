import { useState, useEffect, useRef } from 'react';
import { 
  FaMicrophone, FaStopCircle, FaRobot, FaUser, FaFileAudio, 
  FaKeyboard, FaHistory, FaClone, FaCog, FaExpand, FaCompress 
} from 'react-icons/fa';
import '../stylesheets/Chatbox.css';
import avatarPlaceholder from '../assets/3d.png';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showAudioOptions, setShowAudioOptions] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const recognition = useRef(null);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, []);

  // Spacebar handling for Interactive Mode
  useEffect(() => {
    if (isInteractive) {
      const handleKeyDown = (e) => {
        if (e.code === 'Space' && !e.repeat) {
          e.preventDefault();
          setIsSpacePressed(true);
          startRecording();
        }
      };

      const handleKeyUp = (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          setIsSpacePressed(false);
          stopRecording();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isInteractive]);

  // Helper to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Updated send message handler that calls the backend API
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add the user's message to the chat
    const userMessage = { text, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    scrollToBottom();

    // Call the backend API for an AI-generated response
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // You can include additional profile data here if needed
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      const botMessage = { text: data.response, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
      scrollToBottom();
    } catch (error) {
      console.error('Error communicating with backend:', error);
      // Optionally, show an error message to the user
    }
  };

  const startRecording = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsRecording(true);
      
    }
  };

  const stopRecording = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsRecording(false);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const newHistory = [
        ...chatHistory,
        {
          id: Date.now(),
          timestamp: new Date(),
          messages
        }
      ];
      setChatHistory(newHistory);
      localStorage.setItem('chatHistory', JSON.stringify(newHistory));
    }
    setMessages([]);
  };

  const handleAudioOptionClick = (option) => {
    setShowAudioOptions(false);
    switch(option) {
      case 'record':
        startRecording();
        break;
      case 'upload':
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.onchange = (e) => {
          const file = e.target.files[0];
          // Handle file upload (e.g., send to backend for transcription)
        };
        fileInput.click();
        break;
      case 'transcript':
        const transcript = prompt('Enter your transcript:');
        if (transcript) handleSendMessage(transcript);
        break;
      default:
        break;
    }
  };

  const toggleInteractiveMode = () => {
    if (!isInteractive) {
      setShowGuide(true);
    }
    setIsInteractive(!isInteractive);
  };

  return (
    <div className="chatbox-container">
      {/* Guide Modal */}
      {showGuide && (
        <div className="guide-modal">
          <div className="guide-content">
            <h3>Interactive Mode Guide</h3>
            <ul>
              <li>Press SPACEBAR to start recording</li>
              <li>Release SPACEBAR to send audio</li>
              <li>Avatar will respond through audio</li>
              <li>All conversations are saved</li>
            </ul>
            <button 
              className="guide-close"
              onClick={() => setShowGuide(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Top Control Bar */}
      <div className="control-bar">
        <button className="control-button">
          <FaHistory className="icon" />
          <span>History</span>
        </button>
        <button className="control-button">
          <FaClone className="icon" />
          <span>Voice Clone</span>
        </button>
        <button className="control-button">
          <FaCog className="icon" />
          <span>Settings</span>
        </button>
      </div>

      <div className={`chat-content ${isInteractive ? 'interactive-mode' : ''}`}>
        {/* Avatar Section */}
        <div className={`avatar-section ${isInteractive ? 'fullscreen' : ''}`}>
          <img 
            src={avatarPlaceholder} 
            alt="AI Avatar" 
            className={`avatar-image ${isSpacePressed ? 'pulsing' : ''}`}
          />
          {isInteractive && (
            <div className="interactive-overlay">
              Press & Hold SPACE to talk
            </div>
          )}

          {/* Interactive Mode Toggle Button */}
          <div className="interactive-toggle-container">
            <button
              className={`interactive-toggle ${isInteractive ? 'active' : ''}`}
              onClick={toggleInteractiveMode}
            >
              {isInteractive ? <FaCompress /> : <FaExpand />}
              <span>{isInteractive ? 'Exit Interactive Mode' : 'Interactive Mode'}</span>
            </button>
          </div>
        </div>

        {!isInteractive && (
          <div className="main-chat-area">
            {/* Messages Container */}
            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-bubble ${message.isUser ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-header">
                    {message.isUser ? <FaUser /> : <FaRobot />}
                    <span className="message-sender">
                      {message.isUser ? 'You' : 'PersonaAI'}
                    </span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="message-text">{message.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-container">
              <div className="input-wrapper">
                <div className="audio-options-wrapper">
                  <button 
                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                    onClick={() => setShowAudioOptions(!showAudioOptions)}
                  >
                    {isRecording ? <FaStopCircle /> : <FaMicrophone />}
                  </button>

                  {showAudioOptions && (
                    <div className="audio-options-menu">
                      <button 
                        className="option-item"
                        onClick={() => handleAudioOptionClick('record')}
                      >
                        <FaMicrophone className="option-icon" />
                        Record Audio
                      </button>
                      <button
                        className="option-item"
                        onClick={() => handleAudioOptionClick('upload')}
                      >
                        <FaFileAudio className="option-icon" />
                        Upload Audio
                      </button>
                      <button
                        className="option-item"
                        onClick={() => handleAudioOptionClick('transcript')}
                      >
                        <FaKeyboard className="option-icon" />
                        Add Transcript
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                  placeholder="Type your message or choose an audio option..."
                  className="message-input"
                />
                
                <button
                  onClick={() => handleSendMessage(inputText)}
                  className="send-button"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
