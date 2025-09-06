/*
  Warnings:

  - The `tag` column on the `category` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."CategoryTags" AS ENUM ('handmade', 'wool', 'tool', 'material', 'combo', 'promotion', 'other');

-- AlterTable
ALTER TABLE "public"."cart_item" ADD COLUMN     "classify" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."category" DROP COLUMN "tag",
ADD COLUMN     "tag" "public"."CategoryTags" NOT NULL DEFAULT 'other';

-- AlterTable
ALTER TABLE "public"."order_item" ADD COLUMN     "classify" TEXT;

-- AlterTable
ALTER TABLE "public"."product" ADD COLUMN     "classify" JSONB DEFAULT '[]';
