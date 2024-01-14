"use client";

import React from "react";

import { GameReturnType } from "@/types";
import useWordle from "@/hooks/use-wordle";

// components
import Grid from "./Grid";
import Keypad from "./Keypad";

interface Props {
  wordleData: GameReturnType;
}

export default function Wordle({ wordleData }: Props) {
  const { currentGuess, guesses, turn, handleClick, usedKeys } =
    useWordle(wordleData);
  const reward = "π5";

  return (
    <section className="wordle" id="wordle">
      <div className="wordle-bx">
        <div>
          <h2>{`Win ${reward}`}</h2>
          <p>
            {`Game title: ${wordleData.round.id}`}
            <br></br>{" "}
            {`Winner: ${wordleData.round.winner?.username || "No winner"}`}.
          </p>
          <>
            <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
            <Keypad handleClick={handleClick} usedKeys={usedKeys} />
          </>
        </div>
      </div>
    </section>
  );
}
