-- ==========================================
-- SCRIPT: DELETE ALL PRODUCTS
-- ==========================================
-- This script will safely remove all products from the database.
-- 
-- Dependencies:
-- 'order_items' table references products with 'ON DELETE SET NULL'.
-- This means any existing orders will retain their data, but the product 
-- link will be removed, ensuring order history is preserved safely.
-- ==========================================

DELETE FROM public.products;
