-- CreateEnum
CREATE TYPE "PiTransactionStatus" AS ENUM ('INITIALIZED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "PiTransaction" ADD COLUMN     "status" "PiTransactionStatus" NOT NULL DEFAULT 'INITIALIZED';
