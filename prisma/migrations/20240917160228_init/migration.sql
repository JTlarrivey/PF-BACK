/*
  Warnings:

  - You are about to drop the column `registrationDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `isAdmin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "registrationDate",
DROP COLUMN "role",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;
