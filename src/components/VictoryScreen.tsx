import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VictoryScreenProps {
  winner: string;
  onPlayAgain: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner, onPlayAgain }) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Disable confetti after a few seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="victory-screen">
      <h1>VICTORY!</h1>
      <h2>{winner} WINS!</h2>

      {showConfetti && <div className="particles"></div>}

      <div className="victory-buttons">
        <button onClick={onPlayAgain} className="play-again-btn">
          Play Again
        </button>
        <button onClick={() => navigate('/')} className="main-menu-btn">
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;