-- CreateEnum
CREATE TYPE "PiTransactionType" AS ENUM ('CLAIM_REWARD', 'REFUND', 'BUY_COINS');

-- CreateEnum
CREATE TYPE "RoundStage" AS ENUM ('STARTED', 'FINISHED', 'CLAIMED');

-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "onboardingEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "referrer" TEXT,
    "referralCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "HuntRound" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "noOfPlayers" INTEGER NOT NULL DEFAULT 0,
    "stage" "RoundStage" NOT NULL DEFAULT 'STARTED',
    "winnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HuntRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HunterActivity" (
    "id" TEXT NOT NULL,
    "tries" INTEGER NOT NULL DEFAULT 0,
    "hunterId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HunterActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityGuess" (
    "id" TEXT NOT NULL,
    "guess" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityGuess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PiTransaction" (
    "amount" DOUBLE PRECISION NOT NULL,
    "txId" TEXT,
    "paymentId" TEXT NOT NULL,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "type" "PiTransactionType" NOT NULL DEFAULT 'BUY_COINS',
    "purposeId" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referrer_key" ON "User"("referrer");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "PiTransaction_paymentId_key" ON "PiTransaction"("paymentId");

-- AddForeignKey
ALTER TABLE "HuntRound" ADD CONSTRAINT "HuntRound_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HunterActivity" ADD CONSTRAINT "HunterActivity_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HunterActivity" ADD CONSTRAINT "HunterActivity_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "HuntRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityGuess" ADD CONSTRAINT "ActivityGuess_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "HunterActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PiTransaction" ADD CONSTRAINT "PiTransaction_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
