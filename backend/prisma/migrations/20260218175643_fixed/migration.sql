-- AlterTable
ALTER TABLE "PurchaseItem" ALTER COLUMN "qtyCartons" DROP NOT NULL,
ALTER COLUMN "qtyUnits" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "total" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "unitPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ReceivingItem" ALTER COLUMN "receivedCartons" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "containerId" TEXT,
ALTER COLUMN "containerNo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShipmentItem" ALTER COLUMN "shippedCartons" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
