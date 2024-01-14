"use server";
import { AddNewGuess, AddNewGuessOutput } from "@/types";

// add a new guess to the guesses state
// update the isCorrect state if the guess is correct
// add one to the turn state
export const addNewGuess: AddNewGuess = ({
  currentGuess,
  formattedGuess,
  solution,
  guesses,
  turn,
  history,
  usedKeys,
}) => {
  let newGuesses = [...guesses];
  newGuesses[turn] = formattedGuess;
  let newUsedKeys = usedKeys;
  formattedGuess.forEach((l) => {
    const currentColor = usedKeys[l.key];

    if (l.color === "green") {
      newUsedKeys[l.key] = "green";
      return;
    }
    if (l.color === "yellow" && currentColor !== "green") {
      newUsedKeys[l.key] = "yellow";
      return;
    }
    if (l.color === "grey" && currentColor !== ("green" || "yellow")) {
      newUsedKeys[l.key] = "grey";
      return;
    }
  });

  const output: AddNewGuessOutput = {
    isCorrect: currentGuess === solution,
    guesses: newGuesses,
    turn: turn + 1,
    history: [...history, currentGuess],
    usedkeys: newUsedKeys,
  };

  return output;
};
