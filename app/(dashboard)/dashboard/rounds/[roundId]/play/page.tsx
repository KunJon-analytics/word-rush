import React from "react";

import Wordle from "@/components/play/Wordle";
import { getRoundData } from "@/actions/wordle";
import { Wrapper } from "@/components/play/Wrapper";

interface Props {
  params: { roundId: string };
}

const PlayPage = async ({ params: { roundId } }: Props) => {
  const wordleData = await getRoundData(roundId);

  return (
    <main className="grid grid-cols-1 place-content-start w-full pb-8">
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:mt-6 lg:gap-6">
        <Wrapper wordleData={wordleData}>
          <Wordle wordleData={wordleData} />
        </Wrapper>
      </div>
    </main>
  );
};

export default PlayPage;
