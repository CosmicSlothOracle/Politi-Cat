# POLITI CAT

The ultimate political card game in retro arcade style.

## About

POLITI CAT is a digital card game featuring political figures from around the world. Each card has six attributes:

- Charisma
- Leadership
- Influence
- Integrity
- Trickery
- Wealth

The game works like the classic "Top Trumps" card game where players compare attribute values to win cards.

## Features

- Retro arcade-style pixel art design
- Single-player mode against AI
- 10 politician cards with unique stats
- Original soundtrack and sound effects

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/politi-cat.git
cd politi-cat
```

2. Install dependencies

```
npm install
```

3. Start the development server

```
npm run dev
```

4. Open your browser to `http://localhost:5173`

## How to Play

1. Start the game by clicking "Play Against AI"
2. Enter your name and click "Start Game"
3. On your turn, select an attribute from your card
4. The attribute values of both cards are compared
5. The player with the higher value wins both cards
6. In case of a tie, the cards go to a tie pile
7. The first player to collect all cards wins!

## Development

### Built With

- React
- TypeScript
- Vite
- React Router

### Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/game` - Game logic
  - `/styles` - CSS styles
- `/public` - Static assets
  - `/cards` - Card images
  - `/assets` - UI and audio assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.
