// Smoke test: one virtual user for 30 seconds. Proves the script and the app work before you add load.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  vus: 1,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const res = http.get(`${BASE}/api/books?page=1`);
  check(res, { "status is 200": (r) => r.status === 200, "has 50 books": (r) => r.json("books").length === 50 });
  sleep(1);
}
