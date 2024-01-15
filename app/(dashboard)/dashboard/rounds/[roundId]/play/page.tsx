import React from "react";

import Wordle from "@/components/play/Wordle";
import { getRoundData } from "@/actions/wordle";

interface Props {
  params: { roundId: string };
}

const PlayPage = async ({ params: { roundId } }: Props) => {
  const wordleData = await getRoundData(roundId);

  return (
    <div>
      <Wordle wordleData={wordleData} />
    </div>
  );
};

export default PlayPage;
