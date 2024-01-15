import { GameReturnType } from "@/types";

export const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const fakeRound: GameReturnType = {
  createdAt: new Date(),
  id: "bbgvyvvv",
  updatedAt: new Date(),
  guesses: [
    {
      activityId: "activityId",
      color: "grey,yellow,grey,grey,green",
      createdAt: new Date(),
      guess: "tyoiy",
      id: "id",
      index: 0,
      isCorrect: false,
      updatedAt: new Date(),
    },
    {
      activityId: "activityId2",
      color: "yellow,green,green,green,green",
      createdAt: new Date(),
      guess: "lerry",
      id: "id",
      index: 1,
      isCorrect: false,
      updatedAt: new Date(),
    },
  ],
  hunterId: "hunterId",
  round: {
    _count: { activities: 1, winner: 0 },
    createdAt: new Date(),
    id: "Roundid",
    stage: "STARTED",
    updatedAt: new Date(),
    winner: { username: "gshawn" },
  },
  roundId: "roundId",
};

export const getWordColor = (guess: string, solution: string) => {
  // "green,yellow,grey,green,yellow"
  let color = "";
  const solutionArray = solution.split("");
  const guessArray = guess.split("");
  for (let index = 0; index < solutionArray.length; index++) {
    if (solutionArray[index] === guessArray[index]) {
      //  find green letters
      color = `${color},green`;
    } else if (
      solutionArray.includes(guessArray[index]) &&
      solutionArray[index] !== guessArray[index]
    ) {
      //  find any yellow letters
      color = `${color},yellow`;
    } else {
      //  find any gret letters
      color = `${color},grey`;
    }
  }
  return color.slice(1);
};

export const yearlySubscription = { pi: 1, tokens: 24 * 366 };

export const pointsConfig = { winner: 5, success: 3, failed: 1, referral: 1 };
