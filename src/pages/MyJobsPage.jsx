import { useState, useEffect } from "react";
import apiFetch from "../api/index.js";
import { Btn, Toast, Spinner, Empty } from "../components/index.jsx";

// ── Status pill ───────────────────────────────────────────────────
const ActivePill = ({ active }) => (
  <span style={{
    padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: active ? "#e6f4ea" : "#fce8e6",
    color: active ? "#1e8e3e" : "#d93025",
    border: `1px solid ${active ? "#1e8e3e40" : "#d9302540"}`,
  }}>
    {active ? "● Active" : "● Closed"}
  </span>
);

// ── Edit Form ─────────────────────────────────────────────────────
const EditForm = ({ job, token, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title:          job.title,
    location:       job.location,
    job_type:       job.job_type,
    experience_min: job.experience_min,
    experience_max: job.experience_max,
    salary_min:     job.salary_min || "",
    salary_max:     job.salary_max || "",
    description:    job.description || "",
    required_skills: (job.required_skills || []).join(", "),
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.location) { setErr("Title and location required"); return; }
    setSaving(true);
    const d = await apiFetch.patch(`/jobs/${job.id}/update/`, form, token);
    if (d.message) onSave();
    else setErr(d.error || "Failed to save");
    setSaving(false);
  };

  return (
    <div style={{ padding: "20px 24px", borderTop: "1px solid #e8e8e8", background: "#fafafa", animation: "fadeIn .2s ease" }}>
      <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#444" }}>Edit Job Listing</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label>Job Title *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div>
          <label>Location *</label>
          <input value={form.location} onChange={e => set("location", e.target.value)} />
        </div>
        <div>
          <label>Job Type</label>
          <select value={form.job_type} onChange={e => set("job_type", e.target.value)}>
            {["full-time","part-time","contract","internship","remote"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Min Experience (yrs)</label>
          <input type="number" value={form.experience_min} onChange={e => set("experience_min", e.target.value)} />
        </div>
        <div>
          <label>Max Experience (yrs)</label>
          <input type="number" value={form.experience_max} onChange={e => set("experience_max", e.target.value)} />
        </div>
        <div>
          <label>Min Salary (₹/yr)</label>
          <input type="number" value={form.salary_min} onChange={e => set("salary_min", e.target.value)} placeholder="600000" />
        </div>
        <div>
          <label>Max Salary (₹/yr)</label>
          <input type="number" value={form.salary_max} onChange={e => set("salary_max", e.target.value)} placeholder="1200000" />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label>Required Skills (comma-separated)</label>
          <input value={form.required_skills} onChange={e => set("required_skills", e.target.value)} placeholder="Python, Django, SQL" />
          <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
            ⚠ Editing skills will update the skill database. Existing applications won't be affected but future match scores will recalculate.
          </p>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label>Description</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} style={{ resize: "vertical" }} />
        </div>
      </div>
      {err && <p style={{ color: "#d93025", fontSize: 13, marginTop: 8 }}>⚠ {err}</p>}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Btn>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  );
};

// ── Close Job Modal ───────────────────────────────────────────────
const CloseModal = ({ job, token, onClose, onConfirm }) => {
  const [note, setNote]     = useState("");
  const [reason, setReason] = useState("hired");
  const [saving, setSaving] = useState(false);

  const REASONS = [
    { value: "hired",      label: "✓ Position filled — hired someone" },
    { value: "paused",     label: "⏸ Hiring paused temporarily" },
    { value: "cancelled",  label: "✕ Role cancelled / no longer needed" },
    { value: "other",      label: "● Other reason" },
  ];

  const confirm = async () => {
    setSaving(true);
    const closing_note = `[${reason}] ${note}`.trim();
    const d = await apiFetch.patch(`/jobs/${job.id}/close/`, { closing_note }, token);
    if (d.message) onConfirm();
    setSaving(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999, animation: "fadeIn .2s ease",
    }}>
      <div style={{
        background: "#fff", borderRadius: 10, padding: "28px 32px",
        width: "100%", maxWidth: 460, boxShadow: "0 8px 40px rgba(0,0,0,.2)",
      }}>
        <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Close this listing?</h3>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
          <b style={{ color: "#1a1a1a" }}>{job.title}</b> will be hidden from candidates.
          You can reopen it anytime.
        </p>

        {/* Reason selector */}
        <label style={{ marginBottom: 8, display: "block" }}>Reason for closing</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {REASONS.map(r => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              style={{
                padding: "10px 14px", borderRadius: 6, textAlign: "left",
                cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13, fontWeight: reason === r.value ? 700 : 500,
                background: reason === r.value ? "#fff5ee" : "#fff",
                border: `2px solid ${reason === r.value ? "#e05c00" : "#e0e0e0"}`,
                color: reason === r.value ? "#e05c00" : "#444",
                transition: "all .15s",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Optional note */}
        <label>Add a note (optional)</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Hired via referral, budget cut for Q2, role merged with another..."
          rows={3}
          style={{ resize: "none", marginBottom: 20 }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <Btn
            onClick={confirm}
            disabled={saving}
            style={{ background: "#d93025", borderColor: "#d93025" }}
          >
            {saving ? "Closing…" : "Close Listing"}
          </Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
export default function MyJobsPage({ token }) {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [closingJob, setClosingJob] = useState(null);
  const [filter, setFilter]       = useState("all"); // "all" | "active" | "closed"

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    apiFetch.get("/jobs/my-jobs/", token).then(d => {
      setJobs(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [token]);

  const handleReopen = async (jobId) => {
    const d = await apiFetch.patch(`/jobs/${jobId}/reopen/`, {}, token);
    if (d.message) { load(); showToast("Job reopened — visible to candidates again!"); }
    else showToast(d.error || "Failed to reopen", "error");
  };

  const handleCloseConfirm = () => {
    setClosingJob(null);
    load();
    showToast("Job closed — hidden from candidates.");
  };

  const handleEditSave = () => {
    setEditingId(null);
    load();
    showToast("Job listing updated!");
  };

  const filtered = jobs.filter(j => {
    if (filter === "active") return j.is_active;
    if (filter === "closed") return !j.is_active;
    return true;
  });

  const activeCount = jobs.filter(j => j.is_active).length;
  const closedCount = jobs.filter(j => !j.is_active).length;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {closingJob && (
        <CloseModal
          job={closingJob}
          token={token}
          onClose={() => setClosingJob(null)}
          onConfirm={handleCloseConfirm}
        />
      )}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>My Job Listings</h1>
            <p style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
              <span style={{ color: "#1e8e3e", fontWeight: 600 }}>{activeCount} active</span>
              {closedCount > 0 && <span style={{ color: "#888" }}> · {closedCount} closed</span>}
            </p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 4, background: "#f3f2f1", borderRadius: 6, padding: 4 }}>
            {[["all", "All"], ["active", "Active"], ["closed", "Closed"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                style={{
                  padding: "5px 14px", borderRadius: 4, border: "none",
                  background: filter === val ? "#fff" : "transparent",
                  color: filter === val ? "#1a1a1a" : "#666",
                  fontWeight: filter === val ? 700 : 500,
                  fontSize: 13, cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: filter === val ? "0 1px 4px rgba(0,0,0,.1)" : "none",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
        {loading ? <Spinner /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((job, i) => (
              <div
                key={job.id}
                className="card"
                style={{
                  animation: `fadeIn .3s ${i * 0.04}s ease both`,
                  opacity: job.is_active ? 1 : 0.75,
                  borderLeft: job.is_active ? "4px solid #1e8e3e" : "4px solid #d4d2d0",
                  transition: "opacity .2s",
                }}
              >
                {/* Job row */}
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1a5276" }}>{job.title}</h3>
                        <ActivePill active={job.is_active} />
                      </div>

                      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#666", flexWrap: "wrap" }}>
                        <span>📍 {job.location}</span>
                        <span>🧭 {job.experience_min}–{job.experience_max} yrs</span>
                        <span>💼 {job.job_type}</span>
                        {job.salary_min && <span>₹{(job.salary_min/100000).toFixed(1)}L–{(job.salary_max/100000).toFixed(1)}L</span>}
                      </div>

                      {/* Skills */}
                      {job.required_skills?.length > 0 && (
                        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                          {job.required_skills.map(s => (
                            <span key={s} className="pill">{s}</span>
                          ))}
                        </div>
                      )}

                      {/* Closing note */}
                      {!job.is_active && job.closing_note && (
                        <div style={{
                          marginTop: 10, padding: "8px 12px",
                          background: "#fef7e0", borderRadius: 6,
                          fontSize: 13, color: "#7a5c00",
                          border: "1px solid #f0d060",
                        }}>
                          📝 {job.closing_note}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "flex-start" }}>
                      {job.is_active ? (
                        <>
                          <Btn
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingId(editingId === job.id ? null : job.id)}
                          >
                            {editingId === job.id ? "✕ Cancel Edit" : "✏ Edit"}
                          </Btn>
                          <Btn
                            size="sm"
                            variant="secondary"
                            style={{ color: "#d93025", borderColor: "#d93025" }}
                            onClick={() => setClosingJob(job)}
                          >
                            Close Listing
                          </Btn>
                        </>
                      ) : (
                        <Btn
                          size="sm"
                          variant="outline"
                          onClick={() => handleReopen(job.id)}
                        >
                          ↺ Reopen
                        </Btn>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit form — inline below the job */}
                {editingId === job.id && (
                  <EditForm
                    job={job}
                    token={token}
                    onSave={handleEditSave}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <Empty
                icon={filter === "closed" ? "📁" : "💼"}
                title={filter === "closed" ? "No closed listings" : "No active listings"}
                subtitle={filter === "closed" ? "Closed jobs will appear here" : "Head to your dashboard to post a job"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
