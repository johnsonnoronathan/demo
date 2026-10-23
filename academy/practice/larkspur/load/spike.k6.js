// Spike test: a sudden surge, like a newsletter going out. Does the app recover afterwards?
import http from "k6/http";
import { check, sleep } from "k6";
import exec from "k6/execution";

const BASE = __ENV.BASE_URL || "http://localhost:3000";
const TARGET = __ENV.TARGET || "/api/books?page=1"; // e.g. TARGET=/api/recommendations?book_id=7

export const options = {
  stages: [
    { duration: "20s", target: 5 },
    { duration: "5s", target: 100 },
    { duration: "30s", target: 100 },
    { duration: "5s", target: 5 },
    { duration: "30s", target: 5 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    "http_req_duration{phase:before}": ["p(95)<400"],
    "http_req_duration{phase:after}": ["p(95)<400"], // recovered: back to normal once the surge ends
    "http_req_duration{phase:spike}": ["p(95)<2000"],
  },
};

// Tag each request with the phase of the test, so k6 reports before, during and after separately.
function phase() {
  const s = (Date.now() - exec.scenario.startTime) / 1000;
  return s < 20 ? "before" : s < 60 ? "spike" : "after";
}

export default function () {
  const res = http.get(`${BASE}${TARGET}`, { timeout: "10s", tags: { phase: phase() } });
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(0.5);
}
