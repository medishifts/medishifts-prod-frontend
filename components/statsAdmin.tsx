// src/components/StatsCard.tsx
import React from "react";

const StatsCard: React.FC = () => {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Total Users</h3>
        <p>1500</p>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Active Sessions</h3>
        <p>45</p>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Pending Requests</h3>
        <p>12</p>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>System Status</h3>
        <p>Operational</p>
      </div>
    </div>
  );
};

export default StatsCard;
