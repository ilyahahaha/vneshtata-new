-- CreateEnum
CREATE TYPE "Companies" AS ENUM ('Yandex', 'VK', 'AlfaBank', 'Tinkoff', 'Sber', 'MTS', 'Rostelecom');

-- CreateTable
CREATE TABLE "Employment" (
    "id" TEXT NOT NULL,
    "employeeUserId" TEXT,
    "company" "Companies" NOT NULL,
    "position" TEXT NOT NULL,
    "employedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_employeeUserId_fkey" FOREIGN KEY ("employeeUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
