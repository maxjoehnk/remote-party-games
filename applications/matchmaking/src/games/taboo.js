import { broadcastMessage } from '../socket.js';
import { loadCards } from './card-loader.js';

const TabooActionTypes = {
    Timer: 'taboo/timer',
    Guess: 'taboo/guess',
    SkipCard: 'taboo/skip',
    Continue: 'taboo/continue'
};

const TabooView = {
    Explaining: 0,
    Guessing: 1,
    Observing: 2,
    Continue: 3
};

let cards = [
    {
        term: 'Valentines Day',
        taboo: [
            'February',
            'Heart',
            'Hallmark',
            'Cards',
            'Flowers'
        ]
    }
];

loadCards((err, c) => {
    if (err) {
        console.error(err);
        return;
    }
    cards = c;
})

class TabooGame {
    constructor(teams) {
        this.config = {
            timer: 60,
            teamOne: teams[0],
            teamTwo: teams[1]
        };
        this.pastWords = [];
        this.type = 'taboo';
        this.handlers = new Map();
        this.handlers.set(TabooActionTypes.Timer, this._handleTimer);
        this.handlers.set(TabooActionTypes.SkipCard, this._nextCard);
        this.handlers.set(TabooActionTypes.Guess, this._guess);
        this.handlers.set(TabooActionTypes.Continue, this._continueGame);
        this.teamOnePoints = 0;
        this.teamTwoPoints = 0;
        this.currentTeam = 1;
        this.teamOnePlayer = 0;
        this.teamTwoPlayer = 0;
        this.timeLeft = this.config.timer;
        this._nextCard();
    }

    get state() {
        return {
            teamOne: {
                players: this.config.teamOne.players,
                points: this.teamOnePoints
            },
            teamTwo: {
                players: this.config.teamTwo.players,
                points: this.teamTwoPoints
            },
            currentRound: {
                team: this.currentTeam,
                activePlayer: this.currentTeam === 1 ?
                    this.config.teamOne.players[this.teamOnePlayer] :
                    this.config.teamTwo.players[this.teamTwoPlayer],
                timeLeft: this.timeLeft
            },
            currentCard: this.currentCard
        };
    }

    start() {
        this._startTimer();
    }

    _startTimer() {
        if (this.timer != null) {
            return;
        }
        this.timer = setInterval(() => {
            this.execute({
                actionType: TabooActionTypes.Timer
            });
        }, 1000);
    }

    execute(action) {
        const handler = this.handlers.get(action.actionType);
        if (handler == null) {
            console.warn(`[Taboo] No action handler for ${action.actionType}`);
            return;
        }
        handler(action);
        this._broadcast();
    }

    _handleTimer = () => {
        this.timeLeft--;
        if (this.timeLeft < 0) {
            this._stopTimer();
            this._nextPlayer();
        }
    }

    _stopTimer() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    _nextPlayer = () => {
        this.timeLeft = this.config.timer;
        if (this.currentTeam === 1) {
            this.teamOnePlayer++;
            if (this.teamOnePlayer >= this.config.teamOne.players.length) {
                this.teamOnePlayer = 0;
            }
        } else {
            this.teamTwoPlayer++;
            if (this.teamTwoPlayer >= this.config.teamTwo.players.length) {
                this.teamTwoPlayer = 0;
            }
        }
        this.currentTeam = this.currentTeam === 1 ? 2 : 1;
        this._nextCard();
    }

    _continueGame = () => {
        this._startTimer();
    }

    _guess = () => {
        if (this.currentTeam === 1) {
            this.teamOnePoints++;
        }else {
            this.teamTwoPoints++;
        }
        this._nextCard();
    }

    _nextCard = () => {
        if (this.currentCard != null) {
            this.pastWords.push(this.currentCard.term);
        }
        const availableCards = this._getAvailableCards();
        const nextCardIndex = Math.floor(Math.random() * Math.floor(availableCards.length - 1));
        this.currentCard = availableCards[nextCardIndex];
    }

    _getAvailableCards() {
        const availableCards = cards.filter(c => !this.pastWords.includes(c.term));
        if (availableCards.length === 0) {
            this.pastWords = [];
            return cards;
        }
        return availableCards;
    }

    _broadcast = () => {
        if (this.timer == null) {
            this._broadcastToNextPlayer(this.state);
            return;
        }
        this._broadcastToExplaining(this.state);
        this._broadcastToGuessing(this.state);
        this._broadcastToObserving(this.state);
    }

    _broadcastToNextPlayer = (state) => {
        const msg = {
            type: 'taboo/update',
            gameState: {
                teamOne: state.teamOne,
                teamTwo: state.teamTwo,
                currentRound: state.currentRound,
                view: TabooView.Continue,
                currentCard: state.currentCard
            }
        };
        broadcastMessage(msg, c => c.playerId === state.currentRound.activePlayer);
    }

    _broadcastToExplaining = (state) => {
        const msg = {
            type: 'taboo/update',
            gameState: {
                teamOne: state.teamOne,
                teamTwo: state.teamTwo,
                currentRound: state.currentRound,
                view: TabooView.Explaining,
                currentCard: state.currentCard
            }
        };
        broadcastMessage(msg, c => c.playerId === state.currentRound.activePlayer);
    }

    _broadcastToGuessing = (state) => {
        const msg = {
            type: 'taboo/update',
            gameState: {
                teamOne: state.teamOne,
                teamTwo: state.teamTwo,
                currentRound: state.currentRound,
                view: TabooView.Guessing,
                currentCard: null
            }
        };
        const currentTeam = state.currentRound.team === 1 ? state.teamOne.players : state.teamTwo.players;
        const allGuessingPlayers = currentTeam.filter(playerId => playerId !== state.currentRound.activePlayer);
        broadcastMessage(msg, c => allGuessingPlayers.includes(c.playerId));
    }

    _broadcastToObserving = (state) => {
        const msg = {
            type: 'taboo/update',
            gameState: {
                teamOne: state.teamOne,
                teamTwo: state.teamTwo,
                currentRound: state.currentRound,
                view: TabooView.Observing,
                currentCard: state.currentCard
            }
        };
        const otherTeam = state.currentRound.team !== 1 ? state.teamOne.players : state.teamTwo.players;
        broadcastMessage(msg, c => otherTeam.includes(c.playerId));
    }
}

export function createGame(config) {
    return new TabooGame(config);
}
