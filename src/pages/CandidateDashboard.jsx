import { useState, useEffect } from "react";
import apiFetch from "../api/index.js";
import { Btn, Toast, Spinner, StatusBadge, ScoreBar } from "../components/index.jsx";

export default function CandidateDashboard({ token }) {
  const [data, setData]           = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    apiFetch.get("/accounts/dashboard/", token).then(setData);
  }, [token]);

  const uploadResume = async () => {
    setUploading(true);
    const fd = new FormData();
    fd.append("resume", resumeFile);
    const d = await apiFetch.uploadFile("/accounts/upload-resume/", fd, token);
    showToast(d.message || d.error || "Done", d.message ? "success" : "error");
    setResumeFile(null);
    setUploading(false);
  };

  if (!data) return <Spinner label="Loading dashboard…" />;

  const { profile, recommended_jobs, applications } = data;

  return (
    <div>
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Hello, {profile.username} 👋</h1>
          <p style={{ color: "#666", marginTop: 4 }}>Here's your job search overview</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              ["Applications Sent", applications.length,       "#e05c00"],
              ["Skills Listed",     profile.skills.length,     "#1a73e8"],
              ["Experience",        `${profile.experience_years} yrs`, "#1e8e3e"],
            ].map(([l, v, c]) => (
              <div key={l} className="card" style={{ padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Recent applications */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Recent Applications</h3>
            {applications.length === 0 ? (
              <p style={{ color: "#888", fontSize: 14 }}>No applications yet.</p>
            ) : (
              applications.slice(0, 6).map(a => (
                <div key={a.job_id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: "1px solid #f3f2f1",
                }}>
                  <span style={{ fontWeight: 600, color: "#1a5276" }}>{a.job}</span>
                  <StatusBadge status={a.status} />
                </div>
              ))
            )}
          </div>

          {/* Top matches */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Top Job Matches</h3>
            {recommended_jobs.length === 0 ? (
              <p style={{ color: "#888", fontSize: 14 }}>Upload your resume to see matches.</p>
            ) : (
              recommended_jobs.slice(0, 5).map(r => (
                <div key={r.job_id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: "1px solid #f3f2f1",
                }}>
                  <div style={{
                    width: 34, height: 34, background: "#fff5ee",
                    border: "1px solid #ffd5b0", borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#e05c00", fontSize: 14, flexShrink: 0,
                  }}>
                    {r.title[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#1a5276", fontSize: 14, marginBottom: 4 }}>{r.title}</div>
                    <ScoreBar score={r.match_score} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Profile */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>My Profile</h3>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
                Skills
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {profile.skills.length === 0 ? (
                  <span style={{ color: "#888", fontSize: 13 }}>No skills added yet</span>
                ) : (
                  profile.skills.map(s => (
                    <span key={s} style={{
                      background: "#fff5ee", border: "1px solid #ffd5b0",
                      borderRadius: 20, padding: "2px 10px",
                      fontSize: 12, color: "#c04a00", fontWeight: 600,
                    }}>
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>
                Experience
              </div>
              <div style={{ fontWeight: 700, color: "#1a1a1a" }}>{profile.experience_years} years</div>
            </div>
          </div>

          {/* Resume upload */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>Resume</h3>
            <p style={{ color: "#666", fontSize: 13, marginBottom: 14 }}>Upload PDF, max 4MB. Used for AI matching.</p>

            <label style={{ cursor: "pointer", display: "block", marginBottom: 10 }}>
              <input
                type="file" accept=".pdf"
                onChange={e => setResumeFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <div style={{
                border: `2px dashed ${resumeFile ? "#1e8e3e" : "#d4d2d0"}`,
                borderRadius: 6, padding: "16px", textAlign: "center",
                color: resumeFile ? "#1e8e3e" : "#888", fontSize: 13,
                background: resumeFile ? "#e6f4ea" : "#fafafa",
                transition: "all .2s",
              }}>
                {resumeFile ? `📄 ${resumeFile.name}` : "Click to select PDF"}
              </div>
            </label>

            <Btn onClick={uploadResume} disabled={!resumeFile || uploading} full>
              {uploading ? "Uploading…" : "Upload Resume"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
