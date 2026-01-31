-- CreateTable
CREATE TABLE "subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "shop" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trial_days" INTEGER,
    "is_test" BOOLEAN NOT NULL DEFAULT false,
    "current_period_end" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopify_created_at" DATETIME,
    CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_subscription_id_key" ON "subscription"("subscription_id");

-- CreateIndex
CREATE INDEX "subscription_userId_idx" ON "subscription"("userId");
