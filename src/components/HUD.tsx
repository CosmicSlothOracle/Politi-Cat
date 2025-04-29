import React from 'react';
import { GameState, Category } from '../game/types';

interface HUDProps {
  gameState: GameState;
  onCategorySelect?: (category: Category) => void;
  onNextPhase?: () => void;
  availableCategories?: string[];
  isCategorySelectable?: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  onCategorySelect,
  onNextPhase,
  availableCategories = [],
  isCategorySelectable = false,
}) => {
  const phaseLabels: Record<GameState, string> = {
    [GameState.SETUP]: 'Setup',
    [GameState.DRAW_PHASE]: 'Draw Phase',
    [GameState.CATEGORY_SELECTION]: 'Select a Category',
    [GameState.VALUE_COMPARISON]: 'Compare Values',
    [GameState.RESOLVE_WINNER]: 'Resolving Round',
    [GameState.HANDLE_TIE]: 'Tie Detected',
    [GameState.CHECK_END]: 'Check for End',
    [GameState.GAME_OVER]: 'Game Over',
  };

  return (
    <div className="hud-container">
      <div className="phase-indicator">
        <strong>{phaseLabels[gameState]}</strong>
      </div>

      {gameState === GameState.CATEGORY_SELECTION && isCategorySelectable && (
        <div className="category-buttons">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect?.(cat as Category)}
              className="category-button"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {(gameState === GameState.VALUE_COMPARISON ||
        gameState === GameState.RESOLVE_WINNER ||
        gameState === GameState.HANDLE_TIE ||
        gameState === GameState.CHECK_END) && (
        <button className="next-phase-button" onClick={onNextPhase}>
          Continue
        </button>
      )}

      {gameState === GameState.GAME_OVER && (
        <button className="restart-button" onClick={() => window.location.reload()}>
          Play Again
        </button>
      )}
    </div>
  );
};
