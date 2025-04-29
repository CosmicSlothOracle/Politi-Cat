import React from 'react';
import CardDisplay from './CardDisplay';
import { HUD } from './HUD';
import { Card, Category, GameContext, GameState, PlayerType } from '../game/types';

interface GameBoardProps {
  game: GameContext;
  onCategorySelect: (category: Category) => void;
  onNextPhase: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, onCategorySelect, onNextPhase }) => {
  const { state, player1, player2, topCard1, topCard2, activePlayer, selectedCategory, roundWinner } = game;

  // Determine if we're in category selection or comparison phase
  const isSelectionPhase = state === GameState.CATEGORY_SELECTION;
  const isComparisonPhase = state === GameState.VALUE_COMPARISON || state === GameState.RESOLVE_WINNER;

  // Player card is always visible, opponent card only after category selection
  const showPlayerCard = topCard1 !== undefined && state !== GameState.SETUP;
  const showOpponentCard = topCard2 !== undefined && !isSelectionPhase;

  // Determine if categories are selectable
  const isCategorySelectable = state === GameState.CATEGORY_SELECTION &&
                              ((activePlayer === player1 && player1.type === PlayerType.HUMAN) ||
                              (activePlayer === player2 && player2.type === PlayerType.HUMAN));

  // Determine winner card for highlighting
  const isCard1Winner = state === GameState.RESOLVE_WINNER && roundWinner === player1;
  const isCard2Winner = state === GameState.RESOLVE_WINNER && roundWinner === player2;

  // Available categories
  const availableCategories = Object.values(Category);

  return (
    <div className="game-board">
      <div className="player-info">
        <div className="player-stats">
          <h3>{player1.name}</h3>
          <p>Cards: {player1.deck.length}</p>
        </div>
        <div className="player-stats">
          <h3>{player2.name}</h3>
          <p>Cards: {player2.deck.length}</p>
        </div>
      </div>

      <div className="tie-pile-info">
        {game.tiePile.length > 0 && (
          <p>Tie Pile: {game.tiePile.length} cards</p>
        )}
      </div>

      <div className="cards-display">
        {topCard1 && (
          <div className="player1-card">
            <CardDisplay
              card={topCard1}
              isVisible={showPlayerCard}
              isWinner={isCard1Winner}
            />
          </div>
        )}

        {topCard2 && (
          <div className="player2-card">
            <CardDisplay
              card={topCard2}
              isVisible={showOpponentCard}
              isWinner={isCard2Winner}
            />
          </div>
        )}
      </div>

      {isSelectionPhase && isCategorySelectable && (
        <div className="category-selection">
          {availableCategories.map(category => (
            <button
              key={category}
              className="category-button"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {state === GameState.GAME_OVER && (
        <div className="game-over-overlay">
          <h2>{roundWinner?.name} Wins!</h2>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}

      <HUD
        gameState={state}
        onCategorySelect={onCategorySelect}
        onNextPhase={onNextPhase}
        availableCategories={availableCategories.map(c => c.toString())}
        isCategorySelectable={isCategorySelectable}
      />
    </div>
  );
};

export default GameBoard;