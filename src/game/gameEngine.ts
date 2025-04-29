import { v4 as uuidv4 } from 'uuid';
import { Card, Category, GameState, Player, PlayerType, CardComparison, RoundHistory, CardPlay } from './types';
import cardData from '../data/cards.json';

export class GameEngine {
  private players: Player[] = [];
  private gameState: GameState = GameState.SETUP;
  private currentPlayerIndex: number = 0;
  private _round: number = 0;
  private cardsInPlay: CardPlay[] = [];
  private roundHistory: RoundHistory[] = [];
  private selectedCategory: Category | null = null;
  private _currentComparison: CardComparison | null = null;
  private tieCards: Card[] = [];

  constructor() {
    this.shuffleCards();
  }

  // Hilfsmethode zum Mischen der Karten
  private shuffleCards(): Card[] {
    const cards = [...cardData] as Card[];

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
  }

  // Spiel initialisieren
  public setupGame(humanPlayerName: string, aiCount: number = 1): void {
    this.gameState = GameState.SETUP;
    this.players = [];
    this._round = 0;
    this.roundHistory = [];

    const cards = this.shuffleCards();
    const playerCount = aiCount + 1;
    const cardsPerPlayer = Math.floor(cards.length / playerCount);

    // Menschlichen Spieler erstellen
    const humanPlayer: Player = {
      id: uuidv4(),
      name: humanPlayerName,
      type: PlayerType.HUMAN,
      deck: cards.slice(0, cardsPerPlayer),
      currentCard: null,
      cardsWon: [],
      isActive: true
    };

    this.players.push(humanPlayer);

    // KI-Spieler erstellen
    for (let i = 0; i < aiCount; i++) {
      const aiPlayer: Player = {
        id: uuidv4(),
        name: `Computer ${i + 1}`,
        type: PlayerType.AI,
        deck: cards.slice((i + 1) * cardsPerPlayer, (i + 2) * cardsPerPlayer),
        currentCard: null,
        cardsWon: [],
        isActive: true
      };

      this.players.push(aiPlayer);
    }

    // Setze den ersten Spieler zufällig
    this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);

    this.gameState = GameState.DRAW_PHASE;
  }

  // Karten ziehen
  public drawCards(): void {
    if (this.gameState !== GameState.DRAW_PHASE) {
      throw new Error('Karten können nur in der Zugphase gezogen werden');
    }

    this.cardsInPlay = [];

    for (const player of this.getActivePlayers()) {
      if (player.deck.length > 0) {
        const card = player.deck.shift()!;
        player.currentCard = card;
        this.cardsInPlay.push({ playerId: player.id, card });
      }
    }

    this.gameState = GameState.CATEGORY_SELECTION;
  }

  // Kategorie auswählen
  public selectCategory(category: Category): void {
    if (this.gameState !== GameState.CATEGORY_SELECTION) {
      throw new Error('Kategorie kann nur in der Auswahl-Phase gewählt werden');
    }

    this.selectedCategory = category;
    this.compareValues();
  }

  // Werte vergleichen
  private compareValues(): void {
    if (!this.selectedCategory || this.cardsInPlay.length < 2) {
      throw new Error('Fehler bei der Wertevergleichung');
    }

    this.gameState = GameState.VALUE_COMPARISON;

    const activePlayers = this.getActivePlayers();
    const player1 = activePlayers[0];
    const player2 = activePlayers[1];

    if (!player1.currentCard || !player2.currentCard) {
      throw new Error('Nicht alle Spieler haben eine Karte');
    }

    const category = this.selectedCategory.toLowerCase() as keyof Card;
    const player1Value = player1.currentCard[category] as number;
    const player2Value = player2.currentCard[category] as number;

    let winnerId: string | null = null;

    if (player1Value > player2Value) {
      winnerId = player1.id;
    } else if (player2Value > player1Value) {
      winnerId = player2.id;
    }

    this._currentComparison = {
      category: this.selectedCategory,
      player1Value,
      player2Value,
      winner: winnerId
    };

    this.resolveRound(winnerId);
  }

  // Runde auflösen
  private resolveRound(winnerId: string | null): void {
    this.gameState = GameState.RESOLVE_WINNER;

    // Runde zur Historie hinzufügen
    const roundData: RoundHistory = {
      round: this._round,
      category: this.selectedCategory!,
      cards: [...this.cardsInPlay],
      winner: winnerId,
      wasTie: winnerId === null
    };

    this.roundHistory.push(roundData);

    if (winnerId) {
      // Gewinner bekommt die Karten
      const winner = this.players.find(p => p.id === winnerId);
      if (winner) {
        // Aktuelle Karten zur Gewinnstapel
        for (const player of this.players) {
          if (player.currentCard) {
            winner.cardsWon.push(player.currentCard);
            player.currentCard = null;
          }
        }

        // Auch eventuell vorhandene Tie-Karten hinzufügen
        if (this.tieCards.length > 0) {
          winner.cardsWon.push(...this.tieCards);
          this.tieCards = [];
        }

        // Setze Gewinner als nächsten Spieler
        this.currentPlayerIndex = this.players.findIndex(p => p.id === winnerId);
      }

      this.gameState = GameState.CHECK_END;
    } else {
      // Unentschieden - Karten werden in einen Tie-Stack gelegt
      for (const player of this.players) {
        if (player.currentCard) {
          this.tieCards.push(player.currentCard);
          player.currentCard = null;
        }
      }

      this.gameState = GameState.HANDLE_TIE;
    }
  }

  // Unentschieden behandeln
  public handleTie(): void {
    if (this.gameState !== GameState.HANDLE_TIE) {
      throw new Error('Unentschieden kann nur in der entsprechenden Phase behandelt werden');
    }

    // Gehe zurück zur Zugphase
    this.gameState = GameState.DRAW_PHASE;
  }

  // Spielende prüfen
  public checkGameEnd(): void {
    if (this.gameState !== GameState.CHECK_END) {
      throw new Error('Spielende kann nur in der Check-End-Phase geprüft werden');
    }

    // Prüfe, ob Spieler keine Karten mehr haben
    for (const player of this.players) {
      if (player.deck.length === 0) {
        player.isActive = false;
      }
    }

    // Wenn nur noch ein Spieler aktiv ist, ist das Spiel vorbei
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length <= 1) {
      this.gameState = GameState.GAME_OVER;
      return;
    }

    // Starte neue Runde
    this._round++;
    this.gameState = GameState.DRAW_PHASE;
  }

  // KI wählt eine Kategorie
  public aiSelectCategory(): Category {
    const currentPlayer = this.getCurrentPlayer();

    if (currentPlayer?.type !== PlayerType.AI || !currentPlayer.currentCard) {
      throw new Error('Kein AI-Spieler am Zug oder keine Karte vorhanden');
    }

    // Finde die höchste Werte-Kategorie
    const card = currentPlayer.currentCard;
    const values = [
      { category: Category.CHARISMA, value: card.charisma },
      { category: Category.LEADERSHIP, value: card.leadership },
      { category: Category.INFLUENCE, value: card.influence },
      { category: Category.INTEGRITY, value: card.integrity },
      { category: Category.TRICKERY, value: card.trickery },
      { category: Category.WEALTH, value: card.wealth }
    ];

    values.sort((a, b) => b.value - a.value);

    return values[0].category;
  }

  // Getter und Setter

  public get round(): number {
    return this._round;
  }

  public get currentComparison(): CardComparison | null {
    return this._currentComparison;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getActivePlayers(): Player[] {
    return this.players.filter(player => player.isActive);
  }

  public getCurrentPlayer(): Player | null {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 0) return null;

    return activePlayers[this.currentPlayerIndex % activePlayers.length];
  }

  public getWinner(): Player | null {
    if (this.gameState !== GameState.GAME_OVER) return null;

    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 1) {
      return activePlayers[0];
    }

    // Wenn alle Spieler inaktiv sind, gewinnt der mit den meisten Karten
    let winner = this.players[0];
    for (const player of this.players) {
      if (player.cardsWon.length > winner.cardsWon.length) {
        winner = player;
      }
    }

    return winner;
  }
}

// Export compatible functions for useGameState.ts
export const initializeGame = (playerName: string, aiName: string): GameContext => {
  const engine = new GameEngine();
  engine.setupGame(playerName, 1);

  const activePlayers = engine.getActivePlayers();
  if (activePlayers.length < 2) {
    throw new Error('Failed to initialize game with two players');
  }

  const player1 = activePlayers[0];
  const player2 = activePlayers[1];

  return {
    state: engine.getGameState(),
    player1,
    player2,
    tiePile: [],
    activePlayer: engine.getCurrentPlayer() || player1,
    topCard1: undefined,
    topCard2: undefined
  };
};

export const drawTopCards = (game: GameContext): GameContext => {
  const engine = new GameEngine();
  // Restore state from game context
  engine.setupGame(game.player1.name, 1);
  engine.drawCards();

  const activePlayers = engine.getActivePlayers();

  return {
    ...game,
    state: GameState.CATEGORY_SELECTION,
    activePlayer: activePlayers[0],
    topCard1: activePlayers[0].currentCard,
    topCard2: activePlayers[1].currentCard
  };
};

export const selectCategory = (game: GameContext, category: Category): GameContext => {
  return {
    ...game,
    state: GameState.VALUE_COMPARISON,
    selectedCategory: category
  };
};

export const compareValues = (game: GameContext): GameContext => {
  if (!game.selectedCategory || !game.topCard1 || !game.topCard2) {
    throw new Error('Cannot compare values without cards and category');
  }

  const category = game.selectedCategory.toLowerCase() as keyof Card;
  const player1Value = game.topCard1[category] as number;
  const player2Value = game.topCard2[category] as number;

  let roundWinner = undefined;

  if (player1Value > player2Value) {
    roundWinner = game.player1;
  } else if (player2Value > player1Value) {
    roundWinner = game.player2;
  }

  return {
    ...game,
    state: GameState.RESOLVE_WINNER,
    roundWinner
  };
};

export const resolveWinner = (game: GameContext): GameContext => {
  if (game.roundWinner) {
    // Winner takes both cards
    const updatedWinner = {
      ...game.roundWinner,
      deck: [...game.roundWinner.deck, game.topCard1!, game.topCard2!]
    };

    // Update player objects
    const updatedPlayer1 = game.roundWinner.id === game.player1.id ? updatedWinner : { ...game.player1, deck: game.player1.deck.slice(1) };
    const updatedPlayer2 = game.roundWinner.id === game.player2.id ? updatedWinner : { ...game.player2, deck: game.player2.deck.slice(1) };

    return {
      ...game,
      state: GameState.CHECK_END,
      player1: updatedPlayer1,
      player2: updatedPlayer2,
      topCard1: undefined,
      topCard2: undefined,
      activePlayer: game.roundWinner
    };
  } else {
    // Tie
    return {
      ...game,
      state: GameState.HANDLE_TIE,
      tiePile: [...game.tiePile, game.topCard1!, game.topCard2!],
      topCard1: undefined,
      topCard2: undefined
    };
  }
};

export const handleTie = (game: GameContext): GameContext => {
  return {
    ...game,
    state: GameState.DRAW_PHASE
  };
};

export const checkGameEnd = (game: GameContext): GameContext => {
  // Check if game is over
  if (game.player1.deck.length === 0) {
    return {
      ...game,
      state: GameState.GAME_OVER,
      roundWinner: game.player2
    };
  }

  if (game.player2.deck.length === 0) {
    return {
      ...game,
      state: GameState.GAME_OVER,
      roundWinner: game.player1
    };
  }

  // Continue game
  return {
    ...game,
    state: GameState.DRAW_PHASE
  };
};

export const selectAICategory = (card: Card): Category => {
  const values = [
    { category: Category.CHARISMA, value: card.charisma },
    { category: Category.LEADERSHIP, value: card.leadership },
    { category: Category.INFLUENCE, value: card.influence },
    { category: Category.INTEGRITY, value: card.integrity },
    { category: Category.TRICKERY, value: card.trickery },
    { category: Category.WEALTH, value: card.wealth }
  ];

  values.sort((a, b) => b.value - a.value);
  return values[0].category;
};