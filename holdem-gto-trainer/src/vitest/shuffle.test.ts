import { describe, it, expect } from 'vitest';
import Deck from '../components/shuffler';
import { cardDeck, freshDeck } from '../components/Cards';

describe('Deck', () => {
    it('should create a deck with all cards', () => {
        const deck = new Deck();
        expect(deck.numberOfCards).toBe(52);
    });

    it('should shuffle the deck', () => {
        const deck = new Deck();
        const originalOrder = [...freshDeck()];
        deck.shuffle();
        
        // Get the current cards state by popping all cards
        const shuffledOrder: cardDeck[] = [];
        while (deck.numberOfCards > 0) {
            const card = deck.pop();
            if (card) shuffledOrder.push(card);
        }

        // Check if the cards are in a different order
        expect(shuffledOrder).not.toEqual(originalOrder);
        // Check if all cards are still present
        expect(shuffledOrder.length).toBe(originalOrder.length);
    });

    it('should pop cards from the deck', () => {
        const deck = new Deck();
        const initialCount = deck.numberOfCards;
        const card = deck.pop();

        expect(card).toBeDefined();
        expect(deck.numberOfCards).toBe(initialCount - 1);
    });

    it('should push cards to the deck', () => {
        const deck = new Deck();
        const initialCount = deck.numberOfCards;
        const testCard: cardDeck = { suit: 'hearts', value: 'A' };

        deck.push(testCard);
        expect(deck.numberOfCards).toBe(initialCount + 1);
    });
});
