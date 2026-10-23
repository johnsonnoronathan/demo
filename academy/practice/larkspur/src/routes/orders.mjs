import { query } from "../db.mjs";

// GET /api/orders?email=reader42@larkspur.test — a customer's 20 most recent orders.
export function listOrders(params) {
  const email = params.get("email") || "";
  const orders = query(
    "SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20"
  ).all(email);
  return { email, orders };
}
