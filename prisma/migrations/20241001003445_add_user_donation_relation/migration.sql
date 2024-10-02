-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "preferenceId" TEXT,
    "payerEmail" TEXT NOT NULL,
    "transactionAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "statusDetail" TEXT,
    "paymentMethod" TEXT,
    "paymentType" TEXT,
    "eventType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "rawWebhookData" JSONB NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_paymentId_key" ON "Donation"("paymentId");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
