import { useEffect, useState } from "react";
import apiFetch from "../api/index.js";
import { Empty, JobCard, Spinner, Toast } from "../components/index.jsx";

export default function ExternalJobsPage({ token }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const loadJobs = async (params = {}) => {
    setLoading(true);
    try {
      const data = await apiFetch.get("/jobs/", token, { apply_type: "external", ...params });
      setJobs(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) && data?.error) {
        setToast({ msg: data.error, type: "error" });
      }
    } catch {
      setJobs([]);
      setToast({ msg: "Could not load external jobs right now.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSearch = () => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (location.trim()) params.location = location.trim();
    loadJobs(params);
  };

  return (
    <div>
      {toast && <Toast {...toast} />}

      <div style={{ background: "#1a5276", padding: "28px 24px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>
            External jobs from approved company pages
          </h2>
          <p style={{ color: "#d6e6f2", fontSize: 13, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
            These jobs redirect to the original company application page. We only show summary details here, and availability is controlled by the source site.
          </p>

          <div style={{ display: "flex", background: "#fff", borderRadius: 6, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
            <div style={{ flex: 2, display: "flex", alignItems: "center", borderRight: "1px solid #e0e0e0" }}>
              <span style={{ padding: "0 12px", color: "#999" }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Role or company"
                style={{ border: "none", boxShadow: "none", borderRadius: 0, flex: 1 }}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", borderRight: "1px solid #e0e0e0" }}>
              <span style={{ padding: "0 10px", color: "#999" }}>📍</span>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Location"
                style={{ border: "none", boxShadow: "none", borderRadius: 0, flex: 1 }}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              style={{
                background: "#0f1720",
                color: "#fff",
                border: "none",
                padding: "0 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                flexShrink: 0,
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
        <p style={{ fontSize: 14, color: "#555", fontWeight: 500, marginBottom: 16 }}>
          {loading ? "Checking external listings…" : <><b style={{ color: "#1a1a1a" }}>{jobs.length}</b> external jobs found</>}
        </p>

        {loading ? (
          <Spinner label="Loading external jobs…" color="#1a5276" />
        ) : jobs.length === 0 ? (
          <Empty
            icon="🌐"
            title="No external jobs found"
            subtitle="Add jobs with apply type set to external and a source URL."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {jobs.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                delay={i * 0.03}
                onApply={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
