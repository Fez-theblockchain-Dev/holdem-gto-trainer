// import * as Cards from './Cards';
import { freshDeck } from './Cards';
import { cardDeck } from './Cards';

export default class Deck {
    private cards: cardDeck[];
    
    constructor(cards = freshDeck()) {
        this.cards = cards;
    }
  
    get numberOfCards(): number {
        return this.cards.length;
    }
  
    pop(): cardDeck | undefined {
        return this.cards.shift();
    }
  
    push(card: cardDeck): void {
        this.cards.push(card);
    }

    shuffle(): void {
        for (let i: number = this.numberOfCards - 1; i > 0; i--) {
            const newIndex: number = Math.floor(Math.random() * (i + 1));
            const oldValue: cardDeck = this.cards[newIndex];
            this.cards[newIndex] = this.cards[i];
            this.cards[i] = oldValue;
        }
    }
}