/*
  Warnings:

  - You are about to drop the column `tries` on the `HunterActivity` table. All the data in the column will be lost.
  - Added the required column `index` to the `ActivityGuess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityGuess" ADD COLUMN     "index" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HunterActivity" DROP COLUMN "tries";
