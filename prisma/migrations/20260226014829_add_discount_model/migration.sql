-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "shopifyDiscountId" TEXT,
    "appliesToType" TEXT NOT NULL,
    "appliesToIds" JSONB,
    "discountConfiguration" JSONB NOT NULL,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "combineWithOthers" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Discount_shopifyDiscountId_key" ON "Discount"("shopifyDiscountId");

-- CreateIndex
CREATE INDEX "Discount_shop_idx" ON "Discount"("shop");

-- CreateIndex
CREATE INDEX "Discount_status_idx" ON "Discount"("status");
