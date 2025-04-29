import React from "react";
import { Card } from '../game/types';

type Props = {
  card: Card;
  isVisible: boolean;
  isWinner?: boolean;
};

const CardDisplay: React.FC<Props> = ({ card, isVisible, isWinner = false }) => {
  if (!isVisible) return null;

  return (
    <div className={`card-container ${isWinner ? 'card-winner' : ''}`}>
      <img
        src={card.imagePath}
        alt={card.name}
        className="card-image"
      />
    </div>
  );
};

export default CardDisplay;