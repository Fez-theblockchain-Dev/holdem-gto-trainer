export type cardDeck = {
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
    suit: '♥' | '♦' | '♠' | '♣'
    quantity: 52
} 


interface suites {
    clubs: string;
    diamonds: string;
    spades: string;
    hearts: string;
}

export type Suite = "clubs" | "diamonds" | "spades" | "hearts";


