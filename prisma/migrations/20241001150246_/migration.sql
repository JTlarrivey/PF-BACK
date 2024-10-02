/*
  Warnings:

  - A unique constraint covering the columns `[preferenceId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Donation_preferenceId_key" ON "Donation"("preferenceId");
