-- AlterTable
ALTER TABLE "PurchaseInvoice" ADD COLUMN     "clientCode" TEXT,
ADD COLUMN     "containerNo" TEXT,
ADD COLUMN     "creditDays" INTEGER,
ADD COLUMN     "downPayment" DOUBLE PRECISION,
ADD COLUMN     "headerDiscount" DOUBLE PRECISION,
ADD COLUMN     "storeCode" TEXT;

-- AlterTable
ALTER TABLE "PurchaseItem" ADD COLUMN     "cartonNumber" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "itemCode" TEXT,
ADD COLUMN     "itemNotes" TEXT,
ADD COLUMN     "receivingDate" TIMESTAMP(3);
