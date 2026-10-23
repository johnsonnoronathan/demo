// Stress test: add users in steps until latency or errors break. The step where p95
// bends upward (the knee) is the app's practical capacity.
import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE_URL || "http://localhost:3000";
const STEP = __ENV.STEP || "30s";
const TARGET = __ENV.TARGET || "/api/books?page=1"; // e.g. TARGET=/api/recommendations?book_id=7

export const options = {
  stages: [5, 10, 20, 40, 80].flatMap((target) => [
    { duration: "5s", target },
    { duration: STEP, target },
  ]),
  thresholds: {
    // Not a pass/fail gate: these lines mark where the app stops meeting the budget.
    http_req_duration: [{ threshold: "p(95)<300", abortOnFail: false }],
    http_req_failed: [{ threshold: "rate<0.01", abortOnFail: false }],
  },
};

export default function () {
  const res = http.get(`${BASE}${TARGET}`, { timeout: "10s" });
  check(res, { "status is 200": (r) => r.status === 200 });
}
