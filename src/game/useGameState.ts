import { useState, useEffect, useCallback } from 'react';
import { Category, GameContext, GameState } from './types';
import {
  initializeGame,
  drawTopCards,
  selectCategory,
  compareValues,
  resolveWinner,
  handleTie,
  checkGameEnd,
  selectAICategory
} from './gameEngine';

export const useGameState = (playerName: string) => {
  const [game, setGame] = useState<GameContext | null>(null);

  // Initialize game
  useEffect(() => {
    if (playerName) {
      const initializedGame = initializeGame(playerName, 'AI Opponent');
      setGame(initializedGame);

      // Immediately transition to DRAW_PHASE
      setTimeout(() => {
        setGame(prev => prev ? { ...prev, state: GameState.DRAW_PHASE } : null);
      }, 500);
    }
  }, [playerName]);

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
  const handleCategorySelect = useCallback((category: Category) => {
    if (!game) return;

    const updatedGame = selectCategory(game, category);
    setGame(updatedGame);

    // Automatically proceed to comparison after a short delay
    setTimeout(() => {
      const comparedGame = compareValues(updatedGame);
      setGame(comparedGame);
    }, 500);
  }, [game]);

  // Handle next phase button
  const handleNextPhase = useCallback(() => {
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
  }, [game]);

  return {
    game,
    handleCategorySelect,
    handleNextPhase
  };
};

export default useGameState;