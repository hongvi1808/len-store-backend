/*
  Warnings:

  - You are about to drop the column `birth-date` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `full-name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phone-number` on the `user` table. All the data in the column will be lost.
  - Added the required column `full_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."category" ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "public"."product" ADD COLUMN     "images" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "birth-date",
DROP COLUMN "full-name",
DROP COLUMN "phone-number",
ADD COLUMN     "birth_date" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT;
