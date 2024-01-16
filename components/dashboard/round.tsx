import React from "react";
import { formatDistance } from "date-fns";
import Link from "next/link";

interface Props {
  stage: string;
  id: string;
  guesses: number;
  lastPlayed: Date;
}

const Round = ({ stage, guesses, lastPlayed, id }: Props) => {
  return (
    <div className="flex cursor-pointer items-center justify-between">
      <div className="flex items-center space-x-3.5">
        <div>
          <p className="font-medium">
            <Link
              href={`/dashboard/rounds/${id}/play`}
            >{`Tries: ${guesses}`}</Link>
          </p>
          <p className="text-xs line-clamp-1">
            {formatDistance(lastPlayed, new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="font-medium">{stage}</p>
    </div>
  );
};

export default Round;
