import { useState, useEffect, useRef } from 'react';
import { 
  FaMicrophone, FaStopCircle, FaRobot, FaUser, FaFileAudio, 
  FaKeyboard, FaHistory, FaClone, FaCog, FaExpand, FaCompress 
} from 'react-icons/fa';
import '../stylesheets/Chatbox.css';
import avatarPlaceholder from '../assets/3d.png';
import { Link } from 'react-router-dom';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showAudioOptions, setShowAudioOptions] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  // New loading states:
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);

  const recognition = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);



  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
     if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";
    
      recognition.current.onstart = () => {
       console.log("Recognition started");
      };
    
      recognition.current.onresult = (event) => {
       const transcript = event.results[0][0].transcript;
       console.log("Speech recognized:", transcript);
       handleSendMessage(transcript);
      };
    
      recognition.current.onend = () => {
       console.log("Recognition ended");
       if (isRecording) {
        // Automatically restart if user is still holding space
        try {
         recognition.current.start();
         console.log("Restarting recognition...");
        } catch (err) {
         console.warn("Error restarting recognition:", err);
        }
       }
      };
    
      recognition.current.onerror = (event) => {
       console.error("Recognition error:", event.error);
       if (event.error === "network") {
        alert("Please check your internet connection for speech recognition.");
       }
       setIsRecording(false); // Ensure UI reflects the stopped state
      };
    
     } else {
      alert("Speech recognition is not supported in this browser.");
     }
    }, []);
    

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    // Append user's message
    const userMessage = { text, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    scrollToBottom();

    setIsChatLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      setIsChatLoading(false);

      const botMessage = { text: data.response, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
      scrollToBottom();
    } catch (error) {
      setIsChatLoading(false);
      console.error('Error communicating with backend:', error);
    }
  };

  const startRecording = async () => {
     try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
    
      mediaRecorderRef.current.ondataavailable = (event) => {
       if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
       }
      };
    
      mediaRecorderRef.current.onstop = async () => {
       const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
       const file = new File([audioBlob], 'recorded_audio.webm', { type: 'audio/webm' });
    
       // Optional prompt:
       const userPrompt = window.prompt('Add a prompt (optional):');


    
       // Send to backend
       uploadAudioFile(file, userPrompt);
      };
    
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log('Recording started');
     } catch (err) {
      console.error('Recording failed:', err);
      alert('Microphone access denied or not supported.');
     }
    };
    
    const stopRecording = () => {
     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped');
     }
    };
    


  const handleNewChat = () => {
    if (messages.length > 0) {
      const newHistory = [...chatHistory, { id: Date.now(), timestamp: new Date(), messages }];
      setChatHistory(newHistory);
      localStorage.setItem('chatHistory', JSON.stringify(newHistory));
    }
    setMessages([]);
  };


  const handleAudioOptionClick = (option) => {
    setShowAudioOptions(false);
    switch (option) {
      case 'record':
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
        break;
      case 'upload':
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const extraPrompt = prompt("If you want to add a prompt, enter it here (optional):");
            uploadAudioFile(file, extraPrompt);
          }
        };
        fileInput.click();
        break;
      case 'transcript':
        const transcript = prompt('Enter Date of the records:');
        if (transcript) handleSendMessage(transcript);
        break;
      default:
        break;
    }
  };


  const uploadAudioFile = async (file, extraPrompt = "") => {
    const formData = new FormData();
    formData.append('audio', file);
    if (extraPrompt) {
      formData.append('prompt', extraPrompt);
    }

    setIsAudioUploading(true);

    try {
      const response = await fetch('http://localhost:5000/api/audio', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setIsAudioUploading(false);

      if (data.error) {
        console.error("Error:", data.error);
      } else {
        const transcriptionMsg = { text: `Transcription: ${data.transcription}`, isUser: false, timestamp: new Date() };
        const responseMsg = { text: `Response: ${data.response}`, isUser: false, timestamp: new Date() };
        setMessages(prev => [...prev, transcriptionMsg, responseMsg]);
        scrollToBottom();
      }
    } catch (error) {
      setIsAudioUploading(false);
      console.error("Upload error:", error);
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
      {showGuide && (
        <div className="guide-modal">
          <div className="guide-content">
            <h3>Interactive Mode Guide</h3>
            <ul>
              <li>Press SPACEBAR to start recording</li>
              <li>Release SPACEBAR to send audio</li>
              <li>Avatar will respond through audio</li>
              <li>All conversations are saved locally</li>
            </ul>
            <button className="guide-close" onClick={() => setShowGuide(false)}>
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
          <Link to='/clone-voice'>
          <span>Voice Clone</span>
          </Link>
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

        <div className="main-chat-area">
          {/* Messages Container */}
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message-bubble ${message.isUser ? 'user-message' : 'bot-message'}`}>
                <div className="message-header">
                  {message.isUser ? <FaUser /> : <FaRobot />}
                  <span className="message-sender">{message.isUser ? 'You' : 'PersonaAI'}</span>
                  <span className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="message-text">{message.text}</p>
              </div>
            ))}

            
            {(isChatLoading || isAudioUploading) && (
              <div className="message-bubble bot-message loading">
                <div className="message-header">
                  <FaRobot />
                  <span className="message-sender">PersonaAI</span>
                  <span className="message-time">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="loading-spinner"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-container">
            <div className="input-wrapper">
              <div className="audio-options-wrapper">
                <button
                  className={`mic-button ${isRecording ? 'recording' : ''}`}
                  onClick={() => {
                    if (isRecording) {
                      stopRecording();
                    } else {
                      setShowAudioOptions(!showAudioOptions);
                    }
                  }}
                >
                  {isRecording ? <FaStopCircle /> : <FaMicrophone />}
                </button>
                {showAudioOptions && (
                  <div className="audio-options-menu">
                    <button className="option-item" onClick={() => handleAudioOptionClick('record')}>
                      <FaMicrophone className="option-icon" />
                      Record Audio
                    </button>
                    <button className="option-item" onClick={() => handleAudioOptionClick('upload')}>
                      <FaFileAudio className="option-icon" />
                      Upload Audio
                    </button>
                    <button className="option-item" onClick={() => handleAudioOptionClick('transcript')}>
                      <FaKeyboard className="option-icon" />
                      Retrieve past records
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
              <button onClick={() => handleSendMessage(inputText)} className="send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
