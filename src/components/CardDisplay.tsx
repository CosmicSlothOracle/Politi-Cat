import React from 'react';
import { Card, Category } from '../game/types';

interface CardDisplayProps {
  card: Card;
  isVisible: boolean;
  isWinner?: boolean;
  selectedCategory?: Category;
  onCategorySelect?: (category: Category) => void;
  isCategorySelectable?: boolean;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  isVisible,
  isWinner = false,
  selectedCategory,
  onCategorySelect,
  isCategorySelectable = false,
}) => {
  // Maps a category to its display format and value
  const categoryMap = [
    { key: Category.CHARISMA, value: card.charisma },
    { key: Category.LEADERSHIP, value: card.leadership },
    { key: Category.INFLUENCE, value: card.influence },
    { key: Category.INTEGRITY, value: card.integrity },
    { key: Category.TRICKERY, value: card.trickery },
    { key: Category.WEALTH, value: card.wealth },
  ];

  return (
    <div className={`card-display ${isWinner ? 'card-winner' : ''}`}>
      {isVisible ? (
        <>
          <h3 className="card-name">{card.name}</h3>
          <div className="card-image-container">
            <img src={card.imagePath} alt={card.name} className="card-image" />
          </div>
          <ul className="card-attributes">
            {categoryMap.map(({ key, value }) => (
              <li
                key={key}
                className={`attribute ${selectedCategory === key ? 'highlighted' : ''}`}
                onClick={() => isCategorySelectable && onCategorySelect && onCategorySelect(key)}
              >
                <span className="attribute-name">{key}</span>
                <span className="attribute-value">{value}</span>
              </li>
            ))}
          </ul>
          {card.quote && <p className="card-quote">"{card.quote}"</p>}
        </>
      ) : (
        <div className="card-back">
          <h3>POLITI CAT</h3>
          <div className="card-back-design">
            {/* Card back design */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDisplay;