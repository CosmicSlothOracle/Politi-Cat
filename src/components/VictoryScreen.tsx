import React from 'react';

const VictoryScreen = ({ winner }: { winner: string }) => {
  return (
    <div className="victory-screen">
      <h1>VICTORY!</h1>
      <h2>{winner} WINS!</h2>
      <div className="particles"></div>
    </div>
  );
};

export default VictoryScreen;