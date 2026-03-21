import { useState, useEffect } from "react";
import apiFetch from "../api/index.js";
import { Spinner, Empty, StatusBadge } from "../components/index.jsx";

export default function ApplicationsPage({ token }) {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch.get("/jobs/my-applications/", token).then(d => {
      setApps(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, [token]);

  return (
    <div>
      {/* Page header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>My Applications</h1>
          <p style={{ color: "#666", marginTop: 4, fontSize: 14 }}>
            {apps.length} application{apps.length !== 1 ? "s" : ""} submitted
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <Spinner />
        ) : apps.length === 0 ? (
          <Empty
            icon="📋"
            title="No applications yet"
            subtitle="Start applying to jobs and track your progress here"
          />
        ) : (
          <div className="card">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e8e8e8" }}>
                  {["Job Title", "Status", "Applied On"].map(h => (
                    <th key={h} style={{
                      textAlign: "left", padding: "12px 16px",
                      fontSize: 11, color: "#888", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: .5,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apps.map((app, i) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: i < apps.length - 1 ? "1px solid #f3f2f1" : "none",
                      animation: `fadeIn .3s ${i * 0.04}s ease both`,
                      opacity: 0,
                    }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#1a5276" }}>
                      {app.job_title}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ padding: "14px 16px", color: "#666", fontSize: 13 }}>
                      {new Date(app.applied_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
