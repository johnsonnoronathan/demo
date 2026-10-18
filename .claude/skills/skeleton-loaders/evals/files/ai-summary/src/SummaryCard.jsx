import { useState } from "react";
import "./SummaryCard.css";

// Calls our LLM-backed endpoint, which returns:
// { kpis: [{ label, value, delta }], insights: [string], risks: [{ customer, issue, severity }] }
export default function SummaryCard({ accountId }) {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [summary, setSummary] = useState(null);

  async function generate() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/accounts/${accountId}/summary`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSummary(await res.json());
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <section className="summary">
      <header className="summary-head">
        <h2>Account summary</h2>
        <button className="summary-btn" onClick={generate} disabled={status === "loading"}>
          {status === "loading" ? "Generating…" : summary ? "Regenerate" : "Generate summary"}
        </button>
      </header>

      {status === "loading" && <p className="summary-wait">Generating…</p>}
      {status === "error" && <p className="summary-error">Something went wrong. Please try again.</p>}

      {status === "done" && summary && (
        <div className="summary-body">
          <div className="kpis">
            {summary.kpis.map((k) => (
              <div className="kpi" key={k.label}>
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-value">{k.value}</span>
                <span className={`kpi-delta ${k.delta >= 0 ? "up" : "down"}`}>
                  {k.delta >= 0 ? "+" : ""}{k.delta}%
                </span>
              </div>
            ))}
          </div>

          <h3>Key insights</h3>
          <ul className="insights">
            {summary.insights.map((text, i) => <li key={i}>{text}</li>)}
          </ul>

          <h3>Accounts at risk</h3>
          <table className="risks">
            <thead><tr><th>Customer</th><th>Issue</th><th>Severity</th></tr></thead>
            <tbody>
              {summary.risks.map((r) => (
                <tr key={r.customer}><td>{r.customer}</td><td>{r.issue}</td><td><span className={`sev sev-${r.severity}`}>{r.severity}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
