-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "repeatEnd" DATETIME;

-- CreateTable
CREATE TABLE "AllowedMedication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dosages" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AllowedMedication_name_key" ON "AllowedMedication"("name");
