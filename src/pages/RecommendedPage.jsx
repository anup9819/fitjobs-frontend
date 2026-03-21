import { useState, useEffect } from "react";
import apiFetch from "../api/index.js";
import { Btn, Toast, Spinner, Empty, ScoreBar } from "../components/index.jsx";

export default function RecommendedPage({ token }) {
  const [recs, setRecs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(new Set());
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    apiFetch.get("/jobs/recommended-jobs/", token).then(d => {
      setRecs(d.results || d || []);
      setLoading(false);
    });
  }, [token]);

  const applyJob = async (jobId) => {
    const d = await apiFetch.post("/jobs/apply/", { job: jobId }, token);
    if (d.application_id) {
      setApplied(prev => new Set([...prev, jobId]));
      setToast({ msg: "Application submitted!", type: "success" });
    } else {
      setToast({ msg: d.error || "Failed to apply", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      {toast && <Toast {...toast} />}

      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Jobs recommended for you</h1>
          <p style={{ color: "#666", marginTop: 4, fontSize: 14 }}>Ranked by AI skill &amp; resume match</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <Spinner label="Calculating matches…" />
        ) : recs.length === 0 ? (
          <Empty
            icon="📄"
            title="No recommendations yet"
            subtitle="Upload your resume and add skills to get personalised matches"
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recs.map((rec, i) => (
              <div
                key={rec.job_id}
                className="card"
                style={{
                  padding: "16px 20px",
                  animation: `fadeIn .3s ${i * 0.04}s ease both`,
                  opacity: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 6, flexShrink: 0,
                    background: "#fff5ee", border: "1px solid #ffd5b0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#e05c00",
                  }}>
                    {(rec.title || "J")[0]}
                  </div>

                  {/* Title + bar */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1a5276", marginBottom: 6 }}>
                      {rec.title}
                    </div>
                    <ScoreBar score={rec.match_score} />
                  </div>

                  {/* Apply */}
                  {applied.has(rec.job_id)
                    ? <span style={{ fontSize: 13, color: "#1e8e3e", fontWeight: 700 }}>✓ Applied</span>
                    : <Btn size="sm" onClick={() => applyJob(rec.job_id)}>Apply Now</Btn>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
