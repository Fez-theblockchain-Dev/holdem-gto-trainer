//  this file will store the main screen of the application
//  it will contain the following components:
//  - villainInfo (player type, stack size, table position ext.)
//  - holeCards
//  - actions before it's your turn
//  - three buttons: fold, call, raise

import { useState } from 'react';
import { createClient } from "@supabase/supabase-js";

const MainScreen: React.FC = () => {
    const [response, setResponse] = useState<string | null>(null);
  
    const handleAPIRequest = async () => {
      try {
        const result = await apiClient.post('/completions', {
          model: 'Open Ai GPT-4o', // Specify your model
          max_tokens: 50,
        });
        setResponse(result.data.choices[0].text);
      } catch (error) {
        console.error('API request failed:', error);
        setResponse('Error occurred while fetching data.');
      }
    };

export const seatPositions = {
    0: "small blind",
    1: "big blind",
    2: "utg",
    3: "utg + 1",
    4: "low jack",
    5: "high jack",
    6: "cutoff",
    7: "button"

}



export const table: any = [0, 1, 2, 3, 4, 5, 6, 7];




interface ButtonsProps = {
    type: 'fold': false | 'call': Boolean | 'raise': Boolean;
    enabled: Boolean;
}[]

export const buttonStates : Buttons = [
    Button: Boolean,

    
    const mainScreen = () => {
      return (
        <>
        
        <button>fold</button>
        <button>call</button>
        <button>raise</button>

        </>
      )
    }
    
    mainScreen.propTypes = {Boolean}
    
    export default MainScreen
]



// let buttonClicked = onClick() => {
//     if (buttonStates['fold'].enabled) {
//         buttonStates = () => 
//     } else if (buttonStates['call'].enabled) {
//         // call logic
//     } else if (buttonStates['raise'].enabled) {
//         // raise logic
//     }
// }

const buttonStates = () => {
  const 
  return (
    <div>mainScreen</div>
  )
}

export default MainScreen


