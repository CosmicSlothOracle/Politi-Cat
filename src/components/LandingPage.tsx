import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSound from '../hooks/useSound';
import '../styles/main.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showLibrary, setShowLibrary] = useState<boolean>(false);

  // Use our custom sound hook
  const { isPlaying, toggle } = useSound('/assets/music/theme.mp3', {
    loop: true,
    volume: 0.5
  });

  // Handle navigation to game
  const handlePlayAI = () => {
    navigate('/play');
  };

  // Toggle library view
  const toggleLibrary = () => {
    setShowLibrary(!showLibrary);
  };

  // Library card preview component
  const CardLibrary = () => (
    <div className="library-modal">
      <div className="library-header">
        <h2>CAT Library</h2>
        <button className="close-button" onClick={toggleLibrary}>×</button>
      </div>
      <div className="card-list">
        {/* List of card previews would go here */}
        <p>Coming soon: Browse all Politician Cards</p>
      </div>
    </div>
  );

  return (
    <div className="landing-background">
      <div className="scanline-overlay"></div>

      <h1 className="game-title">POLITI CAT</h1>
      <p className="subtitle">The Ultimate Political Card Game</p>

      <div className="main-buttons">
        <button
          className="play-button"
          onClick={handlePlayAI}
        >
          Play Against AI
        </button>
        <button
          className="play-button disabled"
          disabled
          title="Coming in a future update"
        >
          Play Against a Friend
        </button>
      </div>

      <button
        className="cat-library"
        onClick={toggleLibrary}
      >
        CAT Library
      </button>

      <div
        className={`music-control ${isPlaying ? 'playing' : ''}`}
        onClick={toggle}
      >
        <div className="cassette-icon">
          <div className="wheel left"></div>
          <div className="wheel right"></div>
        </div>
      </div>

      {showLibrary && <CardLibrary />}
    </div>
  );
};

export default LandingPage;
