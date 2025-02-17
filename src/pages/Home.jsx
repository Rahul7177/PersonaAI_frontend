import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AvatarDisplay from '../components/AvatarDisplay';
import avatar from '../assets/3d.png';
import '../stylesheets/Home.css';

const Home = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    // Scroll animations
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
            <span className="highlight">AI Digital Twin</span> Platform
          </h1>
          <p className="hero-description">
            Interact with your personalized AI counterpart through natural conversations, 
            voice cloning, and realistic avatar interactions.
          </p>
          <Link to="/chat" className="cta-button">
            Get Started
          </Link>
        </div>

        {/* 3D Avatar Section */}
        <div className="avatar-container">
          <div className="avatar-wrapper">
            <img src={avatar}/>
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