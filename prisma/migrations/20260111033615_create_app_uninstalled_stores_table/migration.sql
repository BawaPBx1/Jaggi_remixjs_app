-- CreateTable
CREATE TABLE "app_uninstalled_stores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "domain" TEXT,
    "store_id" TEXT,
    "email" TEXT,
    "store_name" TEXT,
    "store_owner" TEXT,
    "currency" TEXT,
    "country_name" TEXT,
    "user_status" TEXT NOT NULL,
    "dev_preview" BOOLEAN,
    "store_created_at" DATETIME,
    "created_at" DATETIME NOT NULL,
    "last_login" DATETIME NOT NULL,
    "uninstalled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "app_uninstalled_stores_shop_key" ON "app_uninstalled_stores"("shop");
