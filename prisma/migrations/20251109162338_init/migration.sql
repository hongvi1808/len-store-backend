-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('Pending', 'Paid', 'Shipping', 'Shipped', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('Cash', 'Credit_Card', 'Paypal', 'Cod', 'Bank_Transfer');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('Pending', 'Success', 'Failed', 'Refunded');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('Admin', 'Seller', 'Customer');

-- CreateEnum
CREATE TYPE "public"."CategoryTags" AS ENUM ('handmade', 'wool', 'tool', 'material', 'combo', 'promotion', 'other');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT,
    "birth_date" BIGINT NOT NULL DEFAULT 0,
    "role" "public"."UserRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "alive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "role" "public"."UserRole"[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "alive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "images" JSONB DEFAULT '[]',
    "classify" JSONB DEFAULT '[]',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "alive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tag" "public"."CategoryTags" NOT NULL DEFAULT 'other',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "alive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_category" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "alive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cart_item" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT,
    "product_id" TEXT NOT NULL,
    "classify" TEXT,
    "price" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "alive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "customer_id" TEXT,
    "customer_info" JSONB DEFAULT '{}',
    "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'Pending',
    "order_number" INTEGER NOT NULL,
    "note" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "classify" TEXT,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL DEFAULT 'Cash',
    "amount" DECIMAL(15,5) NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'Pending',
    "transaction_id" TEXT,
    "paid_at" BIGINT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "public"."user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_id_url_key" ON "public"."permission"("id", "url");

-- CreateIndex
CREATE UNIQUE INDEX "product_id_slug_key" ON "public"."product"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "category_id_slug_key" ON "public"."category"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_id_product_id_key" ON "public"."cart_item"("id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_id_code_key" ON "public"."order"("id", "code");

-- AddForeignKey
ALTER TABLE "public"."product_category" ADD CONSTRAINT "product_category_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_category" ADD CONSTRAINT "product_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
