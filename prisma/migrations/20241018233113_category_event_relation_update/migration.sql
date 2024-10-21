/*
  Warnings:

  - You are about to drop the `_EventCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventCategories" DROP CONSTRAINT "_EventCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventCategories" DROP CONSTRAINT "_EventCategories_B_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "eventId" DROP DEFAULT;

-- DropTable
DROP TABLE "_EventCategories";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
