/*
  Warnings:
  - You are about to drop the column `updatedAt` on the `InventoryItem` table.
  - You are about to drop the column `voucherNo` on the `PaymentVoucher` table.
  - You are about to drop the column `voucherNo` on the `ReceiptVoucher` table.
*/

-- =============================================
-- InventoryItem: drop updatedAt, add createdAt, add totalShipped, add unique indexes
-- =============================================
ALTER TABLE "InventoryItem" DROP COLUMN IF EXISTS "updatedAt";
ALTER TABLE "InventoryItem" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "InventoryItem" ADD COLUMN IF NOT EXISTS "totalShipped" INTEGER NOT NULL DEFAULT 0;

-- Make barcode NOT NULL only if no NULLs exist (safe guard)
UPDATE "InventoryItem" SET "barcode" = '' WHERE "barcode" IS NULL;
ALTER TABLE "InventoryItem" ALTER COLUMN "barcode" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "InventoryItem_itemName_key" ON "InventoryItem"("itemName");
CREATE UNIQUE INDEX IF NOT EXISTS "InventoryItem_barcode_key" ON "InventoryItem"("barcode");

-- =============================================
-- PaymentVoucher: rename voucherNo -> voucherNumber, add new fields
-- =============================================
ALTER TABLE "PaymentVoucher" ADD COLUMN IF NOT EXISTS "voucherNumber" TEXT NOT NULL DEFAULT '';
UPDATE "PaymentVoucher" SET "voucherNumber" = "voucherNo" WHERE "voucherNo" IS NOT NULL;
ALTER TABLE "PaymentVoucher" DROP COLUMN IF EXISTS "voucherNo";
ALTER TABLE "PaymentVoucher" ALTER COLUMN "voucherNumber" DROP DEFAULT;

ALTER TABLE "PaymentVoucher" ADD COLUMN IF NOT EXISTS "currency"     TEXT             NOT NULL DEFAULT 'جنيه';
ALTER TABLE "PaymentVoucher" ADD COLUMN IF NOT EXISTS "description"  TEXT;
ALTER TABLE "PaymentVoucher" ADD COLUMN IF NOT EXISTS "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1;
ALTER TABLE "PaymentVoucher" ADD COLUMN IF NOT EXISTS "paidTo"       TEXT;

-- =============================================
-- ReceiptVoucher: rename voucherNo -> voucherNumber, add new fields
-- =============================================
ALTER TABLE "ReceiptVoucher" ADD COLUMN IF NOT EXISTS "voucherNumber" TEXT NOT NULL DEFAULT '';
UPDATE "ReceiptVoucher" SET "voucherNumber" = "voucherNo" WHERE "voucherNo" IS NOT NULL;
ALTER TABLE "ReceiptVoucher" DROP COLUMN IF EXISTS "voucherNo";
ALTER TABLE "ReceiptVoucher" ALTER COLUMN "voucherNumber" DROP DEFAULT;

ALTER TABLE "ReceiptVoucher" ADD COLUMN IF NOT EXISTS "currency"     TEXT             NOT NULL DEFAULT 'جنيه';
ALTER TABLE "ReceiptVoucher" ADD COLUMN IF NOT EXISTS "description"  TEXT;
ALTER TABLE "ReceiptVoucher" ADD COLUMN IF NOT EXISTS "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1;
ALTER TABLE "ReceiptVoucher" ADD COLUMN IF NOT EXISTS "receivedFrom" TEXT;

-- =============================================
-- PurchaseItem: ADD quantity and unitPrice with defaults for existing rows,
-- KEEP qtyCartons, qtyUnits, price, total (frontend still uses them),
-- add createdAt
-- =============================================
ALTER TABLE "PurchaseItem" ADD COLUMN IF NOT EXISTS "quantity"  INTEGER          NOT NULL DEFAULT 0;
ALTER TABLE "PurchaseItem" ADD COLUMN IF NOT EXISTS "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "PurchaseItem" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Drop the DEFAULT after backfilling so future inserts must provide values
ALTER TABLE "PurchaseItem" ALTER COLUMN "quantity"  DROP DEFAULT;
ALTER TABLE "PurchaseItem" ALTER COLUMN "unitPrice" DROP DEFAULT;

-- NOTE: We intentionally KEEP qtyCartons, qtyUnits, price, total, cbm, discount, weight
-- because the frontend Purchases.tsx still sends and displays these fields.
-- Remove them only after updating the frontend.

-- =============================================
-- ReceivingItem: add createdAt, KEEP damagedUnits/receivedCartons/notes
-- (frontend Receiving page may still use them)
-- =============================================
ALTER TABLE "ReceivingItem" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- NOTE: We intentionally KEEP damagedUnits, receivedCartons, notes on ReceivingItem.

-- =============================================
-- Shipment: The frontend sends containerNo as a free-text string,
-- NOT a containerId FK. We keep containerNo and add referenceNo as NULLABLE
-- to avoid breaking existing rows. We also add shippingCompany.
-- =============================================
ALTER TABLE "Shipment" ADD COLUMN IF NOT EXISTS "referenceNo"     TEXT;
ALTER TABLE "Shipment" ADD COLUMN IF NOT EXISTS "shippingCompany" TEXT;

-- Backfill referenceNo with a unique value for any existing rows
UPDATE "Shipment" SET "referenceNo" = "id" WHERE "referenceNo" IS NULL;

-- Now make it NOT NULL
ALTER TABLE "Shipment" ALTER COLUMN "referenceNo" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Shipment_referenceNo_key" ON "Shipment"("referenceNo");

-- NOTE: We intentionally KEEP containerNo on Shipment.
-- The frontend sends containerNo as a plain string, not a Container FK.
-- Adding containerId FK would require a Container table row to already exist.
-- Migrate to FK-based approach only after updating the frontend.

-- =============================================
-- ShipmentItem: add createdAt, KEEP shippedCartons (frontend still sends it)
-- =============================================
ALTER TABLE "ShipmentItem" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- NOTE: We intentionally KEEP shippedCartons on ShipmentItem.
-- Frontend Shipments.tsx still sends shippedCartons in the form.

-- =============================================
-- ReceivingInvoice: add unique index on invoiceNumber
-- =============================================
CREATE UNIQUE INDEX IF NOT EXISTS "ReceivingInvoice_invoiceNumber_key" ON "ReceivingInvoice"("invoiceNumber");

-- =============================================
-- New tables
-- =============================================
CREATE TABLE IF NOT EXISTS "ItemRegistration" (
    "id"          TEXT         NOT NULL,
    "itemName"    TEXT         NOT NULL,
    "barcode"     TEXT         NOT NULL,
    "description" TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemRegistration_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ItemRegistration_itemName_key" ON "ItemRegistration"("itemName");
CREATE UNIQUE INDEX IF NOT EXISTS "ItemRegistration_barcode_key"  ON "ItemRegistration"("barcode");

CREATE TABLE IF NOT EXISTS "Container" (
    "id"              TEXT         NOT NULL,
    "containerNumber" TEXT         NOT NULL,
    "containerType"   TEXT         NOT NULL DEFAULT 'standard',
    "date"            TIMESTAMP(3),
    "notes"           TEXT,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Container_containerNumber_key" ON "Container"("containerNumber");