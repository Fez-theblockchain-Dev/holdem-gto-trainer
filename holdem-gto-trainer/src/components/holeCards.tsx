// import Deck from "react-poker";
import "react-poker/styles.css"

const cardDeck: cardDeck[] = [];

type cardDeck = {
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
    suit: 'clubs' | 'diamonds' | 'hearts' | 'spades'
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




