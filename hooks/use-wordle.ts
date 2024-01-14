import React, { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  FormatGuess,
  FormatGuesses,
  GameReturnType,
  GetUsedKeys,
  UsedKeys,
} from "@/types";

const useWordle = (round: GameReturnType) => {
  const turn = round.guesses.length;
  const [currentGuess, setCurrentGuess] = useState("");
  const history = round.guesses.map((guess) => guess.guess);

  const { toast } = useToast();

  // format a guess into an array of letter objects
  // e.g. [{key: 'a', color: 'yellow'}]
  const formatGuess: FormatGuess = ({ color, guess }) => {
    const colorArray = color.split(",");
    let formattedGuess = guess.split("").map((l) => {
      return { key: l, color: "" };
    });

    // make colors
    formattedGuess.forEach((l, i) => {
      formattedGuess[i].color = colorArray[i];
    });

    return formattedGuess;
  };

  const formatGuesses: FormatGuesses = (input) => {
    let formattedGuesses = [...Array(6)];
    input.forEach((guess) => {
      formattedGuesses[guess.index] = formatGuess(guess);
    });
    return formattedGuesses;
  };

  const getUsedKeys: GetUsedKeys = (formattedGuesses) => {
    let prevUsedKeys: UsedKeys = {};
    for (let index = 0; index < formattedGuesses.length; index++) {
      const formattedGuess = formattedGuesses[index];
      if (!!formattedGuess) {
        formattedGuess.forEach((l) => {
          const currentColor = prevUsedKeys[l.key];

          if (l.color === "green") {
            prevUsedKeys[l.key] = "green";
            return;
          }
          if (l.color === "yellow" && currentColor !== "green") {
            prevUsedKeys[l.key] = "yellow";
            return;
          }
          if (l.color === "grey" && currentColor !== ("green" || "yellow")) {
            prevUsedKeys[l.key] = "grey";
            return;
          }
        });
      }
    }
    return prevUsedKeys;
  };

  const guesses = formatGuesses(round.guesses);
  const usedKeys = getUsedKeys(guesses);

  // send current guess
  const addNewGuess = (guess: string) => {
    setCurrentGuess("");
  };

  // handle keyup event & track current guess
  // if user presses enter, add the new guess

  const handleClick = (
    alphabet: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const input = alphabet.target as HTMLElement;
    const key = input.innerText;
    console.log("clicked window event: ", `${key}`);
    if (key === "Enter") {
      // only add guess if turn is less than 6
      if (turn > 6) {
        toast({
          variant: "destructive",
          description: "You used all your guesses!",
        });

        console.log("you used all your guesses!");
        return;
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        toast({
          variant: "destructive",
          description: "You already tried that word!",
        });

        console.log("you already tried that word.");
        return;
      }
      // check word is 5 chars
      if (currentGuess.length !== 5) {
        toast({
          variant: "destructive",
          description: "Word must be 5 chars!",
        });
        console.log("word must be 5 chars.");
        return;
      }

      addNewGuess(currentGuess);
    }
    if (key === "Delete") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  return {
    turn,
    currentGuess,
    guesses,
    usedKeys,
    history,
    handleClick,
  };
};

export default useWordle;
