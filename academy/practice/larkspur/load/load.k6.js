// Load test: the traffic Larkspur expects on a busy evening, checked against the budget.
// Ramp to 50 virtual users, hold, ramp down. Each user browses, checks orders, opens a book.
import http from "k6/http";
import { check, sleep, group } from "k6";

const BASE = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 50 },
    { duration: "15s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    "http_req_duration{endpoint:books}": ["p(95)<300"],
    "http_req_duration{endpoint:orders}": ["p(95)<200"],
    "http_req_duration{endpoint:recommendations}": ["p(95)<400"],
  },
};

export default function () {
  group("browse", () => {
    const page = 1 + Math.floor(Math.random() * 20);
    const res = http.get(`${BASE}/api/books?page=${page}`, { tags: { endpoint: "books" } });
    check(res, { "books 200": (r) => r.status === 200 });
  });
  sleep(1);
  group("orders", () => {
    const reader = Math.floor(Math.random() * 20000);
    const res = http.get(`${BASE}/api/orders?email=reader${reader}@larkspur.test`, { tags: { endpoint: "orders" } });
    check(res, { "orders 200": (r) => r.status === 200 });
  });
  sleep(1);
  group("book page", () => {
    const id = 1 + Math.floor(Math.random() * 5000);
    const res = http.get(`${BASE}/api/recommendations?book_id=${id}`, { tags: { endpoint: "recommendations" } });
    check(res, { "recommendations 200": (r) => r.status === 200 });
  });
  sleep(1);
}
