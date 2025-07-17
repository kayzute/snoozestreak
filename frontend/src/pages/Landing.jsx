import { useNavigate } from 'react-router-dom';
import './Landing.css';
import moonImage from '../assets/snoozestreakmoon.png';

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/Dashboard');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">WELCOME TO SNOOZESTREAK</h1>
        <h2 className="landing-subtitle">CLICK HERE TO BEGIN YOUR SLEEP JOURNEY</h2>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
      <img src={moonImage} alt="Moon" className="moon-image" />
    </div>
  );
}