import React from "react";

import { letters } from "@/lib/wordle";
import { UsedKeys } from "@/types";

interface AlphabetsProps {
  usedKeys: UsedKeys;
  handleClick: (alphabet: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Alphabets = ({ usedKeys, handleClick }: AlphabetsProps) => {
  return letters.map((letter) => {
    const l = letter.toLowerCase();
    const color = usedKeys[l];
    return (
      <div key={l} className={color} onClick={handleClick}>
        {l}
      </div>
    );
  });
};

export default Alphabets;
