import React from "react";

import { UsedKeys } from "@/types";

import Alphabets from "./Alphabets";

interface KeypadProps {
  handleClick: (alphabet: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  usedKeys: UsedKeys;
}

export default function Keypad({ handleClick, usedKeys }: KeypadProps) {
  return (
    <div className="keypad">
      <Alphabets handleClick={handleClick} usedKeys={usedKeys} />
      <div className="action" onClick={handleClick}>
        Delete
      </div>
      <div className="action" onClick={handleClick}>
        Enter
      </div>
    </div>
  );
}
