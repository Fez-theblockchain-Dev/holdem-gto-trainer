import cardDeck from "react-poker";
import "react-poker/styles.css"


declare module 'react-poker';





const cardDeck: cardDeck[] = [];


export type cardDeck = {
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
    suit: '♥' | '♦' | '♠' | '♣';
}

export enum HandRank {
    HighCard = 0,
    Pair = 1,
    TwoPair = 2,
    Set = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    Quads = 7,
    StraightFlush = 8,
    RoyalFlush = 9
}

export function freshDeck() {
    const suits = ['♥', '♦', '♠', '♣'] as const;
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
    return suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));


}
