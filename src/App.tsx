import React, { useState } from "react";
import { useSyncedStore } from "@syncedstore/react";
import { getYjsValue } from "@syncedstore/core";
import { store } from "./store"; // the store we defined above
import * as Y from "yjs";


function App() {

  const state = useSyncedStore(store);
  const [input, setInput] = useState('');

  const doc = getYjsValue(state);

  const myClientID = (doc as Y.Doc).clientID
  
  if(!([...state.players].includes(myClientID)))
  {
    state.players.push(myClientID)
    state.gameData.currentPlayerIndex = state.players.length - 1;
    state.gameData.currentPlayerID = state.players[state.gameData.currentPlayerIndex]
  }

  const newGameButtonOnClick = () => {

      state.guesses.splice(0,state.guesses.length);
      state.gameData.answer = Math.floor((Math.random() * 100) + 1);
  }

  const guessButtonOnClick = () => {
    if (state.gameData.currentPlayerID === myClientID) {

      state.guesses.push(Number(input))

      if (state.players.length - 1 === state.gameData.currentPlayerIndex) 
      {
        state.gameData.currentPlayerID = state.players[0];
        state.gameData.currentPlayerIndex = 0;  
      }
      else
      {
          state.gameData.currentPlayerIndex!++;
          state.gameData.currentPlayerID = state.players[state.gameData.currentPlayerIndex!];
      }

    }
  }

  return (
    <>
      <p>{JSON.stringify(state)}</p>
      <h1>Number guess game</h1>
      <h3 style={{color: "green"}}>{state.gameData.currentPlayerID === myClientID ? "Your turn!" : ""}</h3>
      <input type="text" onChange={event => setInput(event.target.value)} ></input>
      <button onClick={guessButtonOnClick}>Guess</button>
      <button onClick={newGameButtonOnClick}>New game</button>
      <ul>
        {
          state.guesses.map(e => <li>{e}{(e > state.gameData.answer! ? " (kisebb)" : (e < state.gameData.answer! ? " (nagyobb)" : " (egyenlő)"))}</li>)
        }
      </ul>
    </>
  );
}

export default App;
