import * as Cards from './Cards';
import { freshDeck } from './Cards';
import { cardDeck } from './Cards'


export default class Deck {
    private cards: cardDeck[];
    constructor(cards = freshDeck()) {
      this.cards = newIndex;
    }
  
    get numberOfCards() {
      return this.cards.length
    }
  
    pop() {
      return this.cards.shift()
    }
  
    push(card) {
      this.cards.push(card)
    }

}

public function shuffle() {
    for (let i: number = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1))
      const oldValue != this.cards[newIndex]
      // ... rest of shuffle implementation ...
    }
  }
}