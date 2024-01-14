import React from "react";

import Wordle from "@/components/play/Wordle";
import { fakeRound } from "@/lib/wordle";

const PlayPage = () => {
  return (
    <div>
      <Wordle wordleData={fakeRound} />
    </div>
  );
};

export default PlayPage;
