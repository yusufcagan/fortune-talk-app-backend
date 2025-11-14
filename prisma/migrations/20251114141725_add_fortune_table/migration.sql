-- CreateTable
CREATE TABLE "Fortune" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "message" TEXT,
    "result" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fortune_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fortune" ADD CONSTRAINT "Fortune_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
