/*
  Warnings:

  - Added the required column `RoomOwnerId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "RoomOwnerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_RoomOwnerId_fkey" FOREIGN KEY ("RoomOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
