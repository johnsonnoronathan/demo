// Soak test: steady, ordinary load for a long time. Watch for slow drift: memory that
// keeps growing, latency that creeps up, connections that leak.
// Default 30 minutes; set DURATION=5m for a quick rehearsal.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "1m", target: 15 },
    { duration: __ENV.DURATION || "30m", target: 15 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<300"],
  },
};

export default function () {
  const page = 1 + Math.floor(Math.random() * 100);
  const res = http.get(`${BASE}/api/books?page=${page}`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
