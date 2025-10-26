-- CreateTable
CREATE TABLE "EachUrl" (
    "id" SERIAL NOT NULL,
    "originalURL" TEXT NOT NULL,

    CONSTRAINT "EachUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hash" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "eachUrlId" INTEGER NOT NULL,

    CONSTRAINT "Hash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EachUrl_originalURL_key" ON "EachUrl"("originalURL");

-- AddForeignKey
ALTER TABLE "Hash" ADD CONSTRAINT "Hash_eachUrlId_fkey" FOREIGN KEY ("eachUrlId") REFERENCES "EachUrl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
