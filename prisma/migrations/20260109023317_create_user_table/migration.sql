-- CreateTable
CREATE TABLE "users" (
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
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_shop_key" ON "users"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "users_store_id_key" ON "users"("store_id");
