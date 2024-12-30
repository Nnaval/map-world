-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "userName" TEXT,
    "placeName" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);
