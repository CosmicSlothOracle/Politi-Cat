import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from './GameBoard';
import Loader from './Loader';
import { GameState } from '../game/types';
import { useGameState } from '../game/useGameState';

const InGamePage: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>('Player 1');
  const [showSetup, setShowSetup] = useState<boolean>(true);
  const navigate = useNavigate();

  // Use custom hook when setup is complete
  const { game, handleCategorySelect, handleNextPhase } = useGameState(
    !showSetup ? playerName : ''
  );

  // Setup screen
  if (showSetup) {
    return (
      <div className="setup-screen">
        <h1 className="game-title">POLITI CAT</h1>
        <div className="setup-form">
          <label htmlFor="player-name">Your Name:</label>
          <input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />
          <div className="setup-buttons">
            <button onClick={() => setShowSetup(false)}>Start Game</button>
            <button onClick={() => navigate('/')}>Back to Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!game) {
    return <Loader message="Preparing Game..." />;
  }

  // Game board
  return (
    <div className="game-container">
      <GameBoard
        game={game}
        onCategorySelect={handleCategorySelect}
        onNextPhase={handleNextPhase}
      />
    </div>
  );
};

export default InGamePage;
