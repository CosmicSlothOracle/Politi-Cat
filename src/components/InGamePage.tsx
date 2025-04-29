import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from './GameBoard';
import { Category, GameContext, GameState } from '../game/types';
import {
  initializeGame,
  drawTopCards,
  selectCategory,
  compareValues,
  resolveWinner,
  handleTie,
  checkGameEnd,
  selectAICategory
} from '../game/gameEngine';

const InGamePage: React.FC = () => {
  const [game, setGame] = useState<GameContext | null>(null);
  const [playerName, setPlayerName] = useState<string>('Player 1');
  const [showSetup, setShowSetup] = useState<boolean>(true);
  const navigate = useNavigate();

  // Initialize the game
  useEffect(() => {
    if (!showSetup && !game) {
      const initializedGame = initializeGame(playerName, 'AI Opponent');
      setGame(initializedGame);

      // Immediately transition to DRAW_PHASE
      setTimeout(() => {
        setGame(prev => prev ? { ...prev, state: GameState.DRAW_PHASE } : null);
      }, 500);
    }
  }, [showSetup, playerName]);

  // Game state machine logic
  useEffect(() => {
    if (!game) return;

    const handleGameState = async () => {
      switch (game.state) {
        case GameState.DRAW_PHASE:
          // Draw cards
          const updatedGame = drawTopCards(game);
          setGame(updatedGame);
          break;

        case GameState.CATEGORY_SELECTION:
          // If active player is AI, automatically select a category
          if (game.activePlayer.isAI && game.topCard1 && game.topCard2) {
            // Get the card that belongs to the AI
            const aiCard = game.activePlayer === game.player1 ? game.topCard1 : game.topCard2;

            // AI selects a category based on its card
            const aiCategory = selectAICategory(aiCard);

            // Short delay to simulate AI thinking
            setTimeout(() => {
              handleCategorySelect(aiCategory);
            }, 1000);
          }
          break;

        default:
          break;
      }
    };

    handleGameState();
  }, [game?.state]);

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    if (!game) return;

    const updatedGame = selectCategory(game, category);
    setGame(updatedGame);

    // Automatically proceed to comparison after a short delay
    setTimeout(() => {
      const comparedGame = compareValues(updatedGame);
      setGame(comparedGame);
    }, 500);
  };

  // Handle next phase button
  const handleNextPhase = () => {
    if (!game) return;

    switch (game.state) {
      case GameState.VALUE_COMPARISON:
      case GameState.RESOLVE_WINNER:
        const resolvedGame = resolveWinner(game);
        setGame(resolvedGame);
        break;

      case GameState.HANDLE_TIE:
        const tieHandledGame = handleTie(game);
        setGame(tieHandledGame);
        break;

      case GameState.CHECK_END:
        const checkedGame = checkGameEnd(game);
        setGame(checkedGame);
        break;

      default:
        break;
    }
  };

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
    return <div className="loading">Loading game...</div>;
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
