import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import VoiceCloning from './pages/VoiceCloning';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <main className="pt-16 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/voice-cloning" element={<VoiceCloning />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;