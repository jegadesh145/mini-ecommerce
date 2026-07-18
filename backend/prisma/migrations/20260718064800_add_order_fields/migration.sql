-- Add shipping fields to Order model
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingAddress" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "phone" TEXT NOT NULL DEFAULT '';