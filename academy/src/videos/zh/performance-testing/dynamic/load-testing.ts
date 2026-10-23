import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "用 k6 做负载测试",
  scenes: [
    {
      label: "引言",
      cues: ["你的计划规定，在 50 个顾客同时购物时，图书接口的 p95 应在 300 毫秒以内。只有负载测试能验证这一点。"],
      panes: [{ type: "title", kicker: "第 3.2 课 · 动态测试", heading: "用 k6 做负载测试", sub: "模拟一个繁忙的夜晚", subAt: 0.4 }],
    },
    {
      label: "脚本",
      cues: [
        "k6 脚本就是 JavaScript。阶段规定运行多少个虚拟用户、运行多久。",
        "阈值规定怎样才算通过：图书接口的 p95 低于 300 毫秒，订单接口低于 200 毫秒。",
        "sleep 加入了思考时间，让每个虚拟用户像一个正在看页面的人，而不是一挺机关枪。",
      ],
      panes: [{
        type: "code", file: "load/load.k6.js", lang: "js", typeTo: 0.85,
        code: `export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 50 },
    { duration: "15s", target: 0 },
  ],
  thresholds: {
    "http_req_duration{endpoint:books}": ["p(95)<300"],
    "http_req_duration{endpoint:orders}": ["p(95)<200"],
  },
};
export default function () {
  http.get(\`\${BASE}/api/books\`, { tags: { endpoint: "books" } });
  sleep(1); // 思考时间
}`,
        highlights: [
          { at: 0.9, until: 1, lines: [2, 3, 4, 5, 6], note: "阶段" },
          { at: 1, until: 2, lines: [7, 8, 9, 10], note: "通过或失败" },
          { at: 2, until: 3, lines: [14], note: "思考时间", good: true },
        ],
      }],
    },
    {
      label: "负载测试如何工作",
      cues: [
        "k6 启动虚拟用户。每个用户循环运行你的脚本：浏览、思考、查看订单、思考、打开一本书。",
        "阶段让用户数逐步增加：30 秒内从 0 增加到 50 个用户，保持一分钟，再逐步减少。",
        "k6 为每个请求计时。在第二章的修复之前，随着用户不断涌入，图书接口的 p95 攀升到超过一秒。",
        "阈值把它变成了失败。订单接口也失败了，尽管它单独运行时很快：Node 只在一个线程上运行，慢接口拖住了其他所有请求。",
      ],
      panes: [{ type: "concept", scene: "virtual-users" }],
    },
    {
      label: "修复之后",
      cues: [
        "完成静态修复之后，同一个测试通过了，而且绰绰有余。",
        "这回答了计划中关于 50 个用户的问题。但它没有说明应用还能多承受多少用户。那是下一课的内容。",
      ],
      panes: [{
        type: "terminal", title: "k6 run load/load.k6.js",
        lines: [
          { at: 0.1, text: "█ THRESHOLDS", kind: "dim" },
          { at: 0.25, text: "✓ books           p(95)<300   p(95)=10.29ms", kind: "pass" },
          { at: 0.4, text: "✓ orders          p(95)<200   p(95)=8.98ms", kind: "pass" },
          { at: 0.55, text: "✓ recommendations p(95)<400   p(95)=34.33ms", kind: "pass" },
          { at: 0.7, text: "✓ http_req_failed rate<0.01   rate=0.00%", kind: "pass" },
          { at: 1, text: "all thresholds passed at 50 virtual users", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
