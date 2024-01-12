/*
  Warnings:

  - A unique constraint covering the columns `[hunterId,roundId]` on the table `HunterActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "ActivityGuess_activityId_idx" ON "ActivityGuess"("activityId");

-- CreateIndex
CREATE INDEX "HuntRound_winnerId_idx" ON "HuntRound"("winnerId");

-- CreateIndex
CREATE INDEX "HunterActivity_hunterId_idx" ON "HunterActivity"("hunterId");

-- CreateIndex
CREATE INDEX "HunterActivity_roundId_idx" ON "HunterActivity"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "HunterActivity_hunterId_roundId_key" ON "HunterActivity"("hunterId", "roundId");

-- CreateIndex
CREATE INDEX "PiTransaction_payerId_idx" ON "PiTransaction"("payerId");

-- CreateIndex
CREATE INDEX "User_referrer_idx" ON "User"("referrer");
