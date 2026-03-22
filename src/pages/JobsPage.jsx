import { useState, useEffect, useCallback } from "react";
import apiFetch from "../api/index.js";
import { Btn, Toast, Spinner, Empty, JobCard } from "../components/index.jsx";

export default function JobsPage({ token, userType }) {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [applied, setApplied]   = useState(new Set());
  const [scores, setScores]     = useState({});  // ← job_id → match_score
  const [toast, setToast]       = useState(null);
  const [search, setSearch]     = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill]       = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Load applied jobs ─────────────────────────────────────────
  useEffect(() => {
    if (userType !== "candidate") return;
    apiFetch.get("/jobs/my-applications/", token).then(d => {
      if (Array.isArray(d)) setApplied(new Set(d.map(app => app.job)));
    });
  }, [token, userType]);

  // ── Load AI match scores in background ───────────────────────
  useEffect(() => {
    if (userType !== "candidate") return;
    apiFetch.get("/jobs/recommended-jobs/", token).then(d => {
      const recs = d.results || d || [];
      const scoreMap = {};
      recs.forEach(r => { scoreMap[r.job_id] = r.match_score; });
      setScores(scoreMap);
    });
  }, [token, userType]);

  const load = useCallback(async (params = {}) => {
    setLoading(true);
    const d = await apiFetch.get("/jobs/", token, params);
    setJobs(Array.isArray(d) ? d : []);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = () => {
    const params = {};
    if (search)   params.search   = search;
    if (location) params.location = location;
    if (skill)    params.skill    = skill;
    load(params);
  };

  const applyJob = async (jobId) => {
    const d = await apiFetch.post("/jobs/apply/", { job: jobId }, token);
    if (d.application_id) {
      setApplied(prev => new Set([...prev, jobId]));
      showToast("Application submitted!");
    } else {
      showToast(d.error || "Could not apply", "error");
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} />}

      {userType === "candidate" && (
        <div style={{ background: "#e05c00", padding: "28px 24px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
              What job are you looking for?
            </h2>
            <div style={{ display: "flex", background: "#fff", borderRadius: 6, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
              <div style={{ flex: 2, display: "flex", alignItems: "center", borderRight: "1px solid #e0e0e0" }}>
                <span style={{ padding: "0 12px", color: "#999" }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Job title, keywords"
                  style={{ border: "none", boxShadow: "none", borderRadius: 0, flex: 1 }}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", borderRight: "1px solid #e0e0e0" }}>
                <span style={{ padding: "0 10px", color: "#999" }}>📍</span>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Location"
                  style={{ border: "none", boxShadow: "none", borderRadius: 0, flex: 1 }}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", borderRight: "1px solid #e0e0e0" }}>
                <span style={{ padding: "0 10px", color: "#999" }}>🛠</span>
                <input value={skill} onChange={e => setSkill(e.target.value)}
                  placeholder="Skill"
                  style={{ border: "none", boxShadow: "none", borderRadius: 0, flex: 1 }}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} />
              </div>
              <button onClick={handleSearch} style={{
                background: "#1a1a1a", color: "#fff", border: "none",
                padding: "0 28px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0,
              }}>
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
        <p style={{ fontSize: 14, color: "#555", fontWeight: 500, marginBottom: 16 }}>
          {loading ? "Searching…" : <><b style={{ color: "#1a1a1a" }}>{jobs.length}</b> jobs found</>}
        </p>

        {loading ? (
          <Spinner label="Finding jobs…" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {jobs.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                delay={i * 0.03}
                onApply={userType === "candidate" ? applyJob : null}
                applied={applied.has(job.id)}
                score={userType === "candidate" ? scores[job.id] : undefined}
              />
            ))}
            {jobs.length === 0 && (
              <Empty icon="🔍" title="No jobs found" subtitle="Try adjusting your search filters" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}