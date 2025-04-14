import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import VoiceCloning from './pages/VoiceCloning';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import MyAccount from './pages/MyAccount';
import TrainData from './pages/TrainData';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="pt-16 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/voice-cloning" element={<VoiceCloning />} />
              <Route path="*" element={<Home />} />
              <Route path="/account" element={<MyAccount/>} />
              <Route path="/train-data" element={<TrainData/>} />
              
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
