-- AlterTable
ALTER TABLE "public"."order" ADD COLUMN     "customer_info" JSONB DEFAULT '{}',
ADD COLUMN     "note" TEXT;
