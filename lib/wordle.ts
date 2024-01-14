import { FormatGuess, FormatGuesses, GameReturnType } from "@/types";

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

// format a guess color into an array of letter objects
// e.g. [{key: 'a', color: 'yellow'}]
export const formatGuess: FormatGuess = ({ color, guess }) => {
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

export const formatGuesses: FormatGuesses = (input) => {
  let formattedGuesses = [...Array(6)];
  input.forEach((guess) => {
    formattedGuesses[guess.index] = formatGuess(guess);
  });
  return formattedGuesses;
};
