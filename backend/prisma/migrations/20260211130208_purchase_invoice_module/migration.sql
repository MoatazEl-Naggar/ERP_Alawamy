-- CreateTable
CREATE TABLE "ReceivingInvoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceivingInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivingItem" (
    "id" TEXT NOT NULL,
    "receivingId" TEXT NOT NULL,
    "purchaseItemId" TEXT NOT NULL,
    "receivedCartons" INTEGER NOT NULL,
    "receivedUnits" INTEGER NOT NULL,
    "damagedUnits" INTEGER,
    "notes" TEXT,

    CONSTRAINT "ReceivingItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReceivingInvoice" ADD CONSTRAINT "ReceivingInvoice_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "PurchaseInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivingItem" ADD CONSTRAINT "ReceivingItem_receivingId_fkey" FOREIGN KEY ("receivingId") REFERENCES "ReceivingInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivingItem" ADD CONSTRAINT "ReceivingItem_purchaseItemId_fkey" FOREIGN KEY ("purchaseItemId") REFERENCES "PurchaseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
