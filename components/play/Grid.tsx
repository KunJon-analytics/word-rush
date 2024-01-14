import React from "react";

import { FormattedGuess } from "@/types";
// components
import Row from "./Row";

interface GridProps {
  guesses: (FormattedGuess[] | undefined)[];
  currentGuess: string;
  turn: number;
}

export default function Grid({ guesses, currentGuess, turn }: GridProps) {
  return (
    <div>
      {guesses.map((g, i) => {
        if (turn === i) {
          return <Row key={i} currentGuess={currentGuess} />;
        }
        return <Row key={i} guess={g} />;
      })}
    </div>
  );
}
