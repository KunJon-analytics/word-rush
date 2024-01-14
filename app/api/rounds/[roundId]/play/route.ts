import { NextResponse } from "next/server";

import { getSession } from "@/actions/session";
import prisma from "@/lib/prisma";
import { getWordColor } from "@/lib/wordle";
import { GameReturnType } from "@/types";

export async function POST(
  req: Request,
  { params }: { params: { roundId: string } }
) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      guess,
    }: {
      guess: string;
    } = await req.json();

    const currentGuess = guess.toLowerCase();

    if (currentGuess.length !== 5) {
      return new NextResponse("Word must be 5 chars!", { status: 400 });
    }

    const huntRound = await prisma.huntRound.findUnique({
      where: { id: params.roundId },
    });

    if (!huntRound) {
      return new NextResponse("No Game Round", { status: 404 });
    }

    const hunterActivity = await prisma.hunterActivity.upsert({
      create: { hunterId: session.uuid, roundId: huntRound.id },
      update: {},
      where: { activityId: { hunterId: session.uuid, roundId: huntRound.id } },
      include: { guesses: true },
    });

    const history = hunterActivity.guesses.map((guess) => guess.guess);

    if (history.length > 6) {
      return new NextResponse("You used all your guesses!", { status: 400 });
    }

    const solution = huntRound.word.toLowerCase();

    if (history.includes(solution)) {
      return new NextResponse("You already completed this round", {
        status: 400,
      });
    }

    if (history.includes(currentGuess)) {
      return new NextResponse("You already tried that word!", { status: 400 });
    }

    const isCorrect = currentGuess === solution;

    const color = getWordColor(currentGuess, solution);

    // add guess and connect to activity
    await prisma.activityGuess.create({
      data: {
        guess: currentGuess,
        index: hunterActivity.guesses.length,
        activityId: hunterActivity.id,
        isCorrect,
        color,
      },
    });

    // if is correct and game is started add player as winner
    if (isCorrect && huntRound.stage === "STARTED") {
      await prisma.huntRound.update({
        where: { id: huntRound.id },
        data: { stage: "FINISHED", winnerId: session.uuid },
      });
      // send mail to winner
    }

    const activity: GameReturnType | null =
      await prisma.hunterActivity.findUnique({
        where: { id: hunterActivity.id },
        include: {
          guesses: true,
          round: {
            select: {
              _count: true,
              createdAt: true,
              id: true,
              stage: true,
              updatedAt: true,
              winner: { select: { username: true } },
            },
          },
        },
      });

    return NextResponse.json(activity);
  } catch (error) {
    console.log("[PLAY_GAME]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { roundId: string } }
) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const huntRound = await prisma.huntRound.findUnique({
      where: { id: params.roundId },
    });

    if (!huntRound) {
      return new NextResponse("No Game Round", { status: 404 });
    }

    const activity: GameReturnType = await prisma.hunterActivity.upsert({
      create: { hunterId: session.uuid, roundId: huntRound.id },
      update: {},
      where: { activityId: { hunterId: session.uuid, roundId: huntRound.id } },
      include: {
        guesses: true,
        round: {
          select: {
            _count: true,
            createdAt: true,
            id: true,
            stage: true,
            updatedAt: true,
            winner: { select: { username: true } },
          },
        },
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.log("[GET_GAME]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
