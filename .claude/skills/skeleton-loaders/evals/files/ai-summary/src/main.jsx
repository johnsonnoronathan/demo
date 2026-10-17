import React from "react";
import ReactDOM from "react-dom/client";
import SummaryCard from "./SummaryCard.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <main className="page">
      <SummaryCard accountId="acc_8f21" />
    </main>
  </React.StrictMode>
);
