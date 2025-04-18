import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/3d.png';
import '../stylesheets/Home.css';

const Home = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
        }
      });
    }, { threshold: 0.1 });

    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      featureCards.forEach(card => observer.observe(card));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">AI Digital Twin</span> Assistant
          </h1>
          <p className="hero-description">
            Interact with your personalized AI counterpart through natural conversations, 
            voice cloning, and realistic avatar interactions.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
            <Link to="/train-data" className="cta-button secondary">Get Started</Link>
            <Link to="/chat" className="cta-button secondary">Chat Now</Link>
            <Link to="/clone-voice" className="cta-button secondary">Clone Voice</Link>
          </div>

          <p className="training-info">
            <strong>Customize Your AI Model:</strong> Begin by clicking <em>“Get Started”</em> to play an interactive quiz that helps your AI learn your preferences, daily routine, and communication style. Then train your voice by recording short clips, enabling realistic, voice-based responses from your AI.
          </p>
        </div>

        {/* 3D Avatar Section */}
        <div className="avatar-container">
          <div className="avatar-wrapper">
            <img src={avatar} alt="3D Avatar" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          {[
            {
              title: 'Voice Interaction',
              description: 'Natural conversations with push-to-talk functionality',
              icon: '🎙️'
            },
            {
              title: 'AI Conversations',
              description: 'Smart responses powered by advanced language models',
              icon: '🤖'
            },
            {
              title: '3D Avatar',
              description: 'Interactive digital representation with emotions',
              icon: '👤'
            }
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Experience the Future?</h2>
        <Link to="/chat" className="cta-button">
          Start Your Journey
        </Link>
      </section>
    </div>
  );
};

export default Home;
