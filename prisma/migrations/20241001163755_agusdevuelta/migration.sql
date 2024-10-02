/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Donation` table. All the data in the column will be lost.
  - Made the column `preferenceId` on table `Donation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Donation_paymentId_key";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "paymentId",
ALTER COLUMN "preferenceId" SET NOT NULL;
