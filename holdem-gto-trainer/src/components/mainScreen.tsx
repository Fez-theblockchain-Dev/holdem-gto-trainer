//  this file will store the main screen of the application
//  it will contain the following components:
//  - villainInfo (player type, stack size, table position ext.)
//  - holeCards
//  - actions before it's your turn
//  - three buttons: fold, call, raise


import apiClient from './api/apiClient';

const mainScreen: React.FC = () => {
    const [response, setResponse] = useState<string | null>(null);
  
    const handleAPIRequest = async () => {
      try {
        const result = await apiClient.post('/completions', {
          model: 'text-davinci-003', // Specify your model
          prompt: 'Hello, world!',  // Replace with your input
          max_tokens: 50,
        });
        setResponse(result.data.choices[0].text);
      } catch (error) {
        console.error('API request failed:', error);
        setResponse('Error occurred while fetching data.');
      }
    };
  

export const seatPositions = {
    1: "small blind",
    2: "big blind",
    3: "utg",
    4: "utg + 1",
    5: "low jack",
    6: "high jack",
    7: "cutoff",
    8: "button"

}



export const table = ["small blind", "big blind", "utg", "utg + 1", "low jack", "high jack", "cutoff","button"]



type Buttons = {
    type: 'fold' | 'call' | 'raise';
    enabled: boolean;
}[]

export const buttonStates : Buttons = [
    { type: 'fold', enabled: true },
    { type: 'call', enabled: true },
    { type: 'raise', enabled: false }
]


if Button(fold) = onClick => {

}