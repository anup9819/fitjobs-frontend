import { useState, useEffect } from "react";
import apiFetch from "../api/index.js";
import { Btn, Toast, Spinner, Empty, ScoreBar } from "../components/index.jsx";

const JOB_FORM_DEFAULT = {
  title: "", description: "", location: "",
  job_type: "full-time",
  experience_min: 0, experience_max: 5,
  salary_min: "", salary_max: "",
  required_skills: "",
  apply_type: "platform",
  external_apply_url: "",
};

// ── Modal wrapper ─────────────────────────────────────────────────
const Modal = ({ children, onClose }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 999, animation: "fadeIn .2s ease",
  }}>
    <div style={{
      background: "#fff", borderRadius: 10, padding: "28px 32px",
      width: "100%", maxWidth: 480,
      boxShadow: "0 8px 40px rgba(0,0,0,.2)",
    }}>
      {children}
    </div>
  </div>
);

export default function RecruiterDashboard({ token }) {
  const [data, setData]               = useState(null);
  const [showCreate, setShowCreate]   = useState(false);
  const [form, setForm]               = useState(JOB_FORM_DEFAULT);
  const [creating, setCreating]       = useState(false);
  const [toast, setToast]             = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates]   = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // ── Modal states ──────────────────────────────────────────────
  const [shortlistModal, setShortlistModal]   = useState(null); // { appId }
  const [shortlistMessage, setShortlistMessage] = useState("");
  const [sendingShortlist, setSendingShortlist] = useState(false);

  const [interviewModal, setInterviewModal]   = useState(null); // { appId }
  const [interviewDate, setInterviewDate]     = useState("");
  const [interviewBody, setInterviewBody]     = useState("");
  const [sendingInterview, setSendingInterview] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = () => apiFetch.get("/accounts/recruiter/dashboard/", token).then(setData);
  useEffect(() => { load(); }, [token]);

  const createJob = async () => {
    if (!form.title || !form.location) {
      showToast("Title and location are required", "error"); return;
    }
    if (form.apply_type === "external" && !form.external_apply_url.trim()) {
      showToast("Please provide the external apply URL", "error"); return;
    }
    setCreating(true);
    const payload = {
      ...form,
      experience_min: Number(form.experience_min),
      experience_max: Number(form.experience_max),
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      required_skills: form.required_skills.split(",").map(s => s.trim()).filter(Boolean),
    };
    const d = await apiFetch.post("/jobs/create/", payload, token);
    if (d.job_id) {
      showToast("Job posted successfully!");
      setShowCreate(false);
      setForm(JOB_FORM_DEFAULT);
      load();
    } else {
      showToast(d.error || "Failed to create job", "error");
    }
    setCreating(false);
  };

  const viewCandidates = async (jobId) => {
    if (selectedJob === jobId) { setSelectedJob(null); return; }
    setSelectedJob(jobId);
    setLoadingCandidates(true);
    const d = await apiFetch.get(`/jobs/${jobId}/ranked-candidates/`, token);
    setCandidates(d.results || d || []);
    setLoadingCandidates(false);
  };

  // ── Status update — intercept shortlisted & interview ─────────
  const updateStatus = async (appId, status) => {
    if (status === 'shortlisted') {
      setShortlistModal({ appId });
      return;
    }
    if (status === 'interview') {
      setInterviewModal({ appId });
      return;
    }
    // All other statuses update directly
    const d = await apiFetch.patch(`/jobs/applications/${appId}/status/`, { status }, token);
    if (d.status) {
      setCandidates(prev => prev.map(c => c.application_id === appId ? { ...c, status } : c));
      showToast(
        status === 'hired'     ? "🎉 Candidate hired! Email sent." :
        status === 'rejected'  ? "Status updated. Rejection email sent." :
        "Status updated"
      );
    } else {
      showToast(d.error || "Failed to update", "error");
    }
  };

  // ── Send shortlist email ──────────────────────────────────────
  const sendShortlistEmail = async () => {
    setSendingShortlist(true);
    const d = await apiFetch.patch(`/jobs/applications/${shortlistModal.appId}/status/`, {
      status:  'shortlisted',
      message: shortlistMessage,
    }, token);
    if (d.status) {
      setCandidates(prev => prev.map(c =>
        c.application_id === shortlistModal.appId ? { ...c, status: 'shortlisted' } : c
      ));
      showToast("Candidate shortlisted & email sent! 🎉");
      setShortlistModal(null);
      setShortlistMessage("");
    } else {
      showToast(d.error || "Failed", "error");
    }
    setSendingShortlist(false);
  };

  // ── Send interview email ──────────────────────────────────────
  const sendInterviewInvite = async () => {
    if (!interviewDate) { showToast("Please set an interview date", "error"); return; }
    setSendingInterview(true);
    const d = await apiFetch.patch(`/jobs/applications/${interviewModal.appId}/status/`, {
      status:         'interview',
      interview_date: interviewDate,
      interview_body: interviewBody,
    }, token);
    if (d.status) {
      setCandidates(prev => prev.map(c =>
        c.application_id === interviewModal.appId ? { ...c, status: 'interview' } : c
      ));
      showToast("Interview invite sent! 📧");
      setInterviewModal(null);
      setInterviewDate("");
      setInterviewBody("");
    } else {
      showToast(d.error || "Failed", "error");
    }
    setSendingInterview(false);
  };

  if (!data) return <Spinner label="Loading dashboard…" />;

  const totalApps = data.jobs.reduce((s, j) => s + j.application_count, 0);

  return (
    <div>
      {toast && <Toast {...toast} />}

      {/* ── Shortlist Modal ── */}
      {shortlistModal && (
        <Modal onClose={() => setShortlistModal(null)}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>🎉 Shortlist Candidate</h3>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
            A congratulations email will be sent to the candidate. They can reply directly to your email.
          </p>
          <div>
            <label>Additional Message (optional)</label>
            <textarea
              value={shortlistMessage}
              onChange={e => setShortlistMessage(e.target.value)}
              rows={4} style={{ resize: "vertical" }}
              placeholder="e.g. We were impressed by your experience. Our team will reach out within 3 business days with next steps..."
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn onClick={sendShortlistEmail} disabled={sendingShortlist}>
              {sendingShortlist ? "Sending…" : "Shortlist & Send Email 🎉"}
            </Btn>
            <Btn variant="secondary" onClick={() => setShortlistModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* ── Interview Modal ── */}
      {interviewModal && (
        <Modal onClose={() => setInterviewModal(null)}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>📅 Send Interview Invitation</h3>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
            An interview invitation email will be sent to the candidate with the details below.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label>Interview Date & Time *</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
              />
            </div>
            <div>
              <label>Additional Message (optional)</label>
              <textarea
                value={interviewBody}
                onChange={e => setInterviewBody(e.target.value)}
                rows={4} style={{ resize: "vertical" }}
                placeholder="e.g. The interview will be conducted via Google Meet. Link: meet.google.com/xxx. Please bring your portfolio."
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn onClick={sendInterviewInvite} disabled={sendingInterview}>
              {sendingInterview ? "Sending…" : "Send Interview Invite 📧"}
            </Btn>
            <Btn variant="secondary" onClick={() => setInterviewModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>Recruiter Dashboard</h1>
            <p style={{ color: "#666", marginTop: 4, fontSize: 14 }}>Manage job postings and review candidates</p>
          </div>
          <Btn onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? "✕ Cancel" : "+ Post a Job"}
          </Btn>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
          {[
            ["Jobs Posted",      data.jobs.length, "#e05c00"],
            ["Total Applicants", totalApps,        "#1a73e8"],
            ["Active Listings",  data.jobs.length, "#1e8e3e"],
          ].map(([l, v, c]) => (
            <div key={l} className="card" style={{ padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: c }}>{v}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Create job form */}
        {showCreate && (
          <div className="card" style={{ padding: "24px", marginBottom: 20, borderLeft: "4px solid #e05c00" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>Post a New Job</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label>Job Title *</label>
                <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Senior Backend Engineer" />
              </div>
              <div>
                <label>Location *</label>
                <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Bangalore, Remote" />
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
                <input value={form.required_skills} onChange={e => set("required_skills", e.target.value)} placeholder="Python, Django, PostgreSQL, REST APIs" />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label>Job Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  rows={5} style={{ resize: "vertical" }}
                  placeholder="Describe the role and responsibilities…"
                />
              </div>

              {/* Application type */}
              <div style={{ gridColumn: "1/-1" }}>
                <label>How should candidates apply?</label>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {[
                    ["platform", "✓ Apply on FitJobs", "Candidates apply directly through our platform"],
                    ["external", "↗ Redirect to company site", "Candidates are sent to your careers page"],
                  ].map(([val, title, desc]) => (
                    <button key={val} onClick={() => set("apply_type", val)} style={{
                      flex: 1, padding: "12px 16px", borderRadius: 6,
                      cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                      textAlign: "left", transition: "all .15s",
                      background: form.apply_type === val ? "#fff5ee" : "#fff",
                      border: `2px solid ${form.apply_type === val ? "#e05c00" : "#e0e0e0"}`,
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: form.apply_type === val ? "#e05c00" : "#1a1a1a" }}>{title}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {form.apply_type === "external" && (
                <div style={{ gridColumn: "1/-1", animation: "fadeIn .2s ease" }}>
                  <label>External Apply URL *</label>
                  <input
                    value={form.external_apply_url}
                    onChange={e => set("external_apply_url", e.target.value)}
                    placeholder="https://careers.yourcompany.com/job/123"
                    type="url"
                  />
                  <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                    Candidates will be redirected to this URL when they click "Apply"
                  </p>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Btn onClick={createJob} disabled={creating}>{creating ? "Posting…" : "Post Job"}</Btn>
              <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
            </div>
          </div>
        )}

        {/* Jobs list */}
        <h2 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#444" }}>Your Job Postings</h2>

        {data.jobs.length === 0 ? (
          <Empty
            icon="💼"
            title="No jobs posted yet"
            subtitle="Post your first job to start receiving applications"
            action={<Btn onClick={() => setShowCreate(true)}>Post a Job</Btn>}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.jobs.map((job, i) => (
              <div key={job.job_id} className="card"
                style={{ animation: `fadeIn .3s ${i * 0.04}s ease both`, opacity: 0 }}>

                {/* Job row */}
                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1a5276" }}>{job.title}</h3>
                      {job.apply_type === "external" && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 7px",
                          borderRadius: 20, background: "#e8f0fe", color: "#1a73e8",
                          border: "1px solid #1a73e840",
                        }}>EXTERNAL ↗</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "#666", display: "flex", gap: 16 }}>
                      <span>👥 {job.application_count} applicant{job.application_count !== 1 ? "s" : ""}</span>
                      {job.top_candidates?.length > 0 && (
                        <span>🏆 Top: {job.top_candidates.map(c => c.candidate_name).join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <Btn
                    size="sm"
                    variant={selectedJob === job.job_id ? "outline" : "secondary"}
                    onClick={() => viewCandidates(job.job_id)}
                  >
                    {selectedJob === job.job_id ? "▲ Hide" : "▾ View Candidates"}
                  </Btn>
                </div>

                {/* Candidates table */}
                {selectedJob === job.job_id && (
                  <div style={{ borderTop: "1px solid #e8e8e8", animation: "fadeIn .25s ease" }}>
                    {loadingCandidates ? (
                      <div style={{ textAlign: "center", padding: 28, color: "#888", fontSize: 14 }}>
                        Loading candidates…
                      </div>
                    ) : candidates.length === 0 ? (
                      <div style={{ padding: "20px 24px", color: "#888", fontSize: 14 }}>
                        No applications received yet.
                      </div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#fafafa" }}>
                            {["#", "Candidate", "Skills", "Match Score", "Status"].map(h => (
                              <th key={h} style={{
                                textAlign: "left", padding: "10px 16px",
                                fontSize: 11, color: "#888", fontWeight: 700,
                                textTransform: "uppercase", letterSpacing: .5,
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {candidates.map((c, idx) => (
                            <tr key={c.application_id || idx} style={{ borderTop: "1px solid #f3f2f1" }}>
                              <td style={{ padding: "12px 16px", color: "#bbb", fontWeight: 700, fontSize: 13 }}>{idx + 1}</td>
                              <td style={{ padding: "12px 16px" }}>
                                <div style={{ fontWeight: 600 }}>{c.candidate_name}</div>
                                <div style={{ fontSize: 11, color: "#888" }}>{c.candidate_email}</div>
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                  {(c.candidate_skills || []).slice(0, 3).map(s => (
                                    <span key={s} className="pill">{s}</span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: "12px 16px", minWidth: 140 }}>
                                {c.score !== undefined
                                  ? <ScoreBar score={Math.min(100, c.score)} />
                                  : <span style={{ color: "#ccc" }}>—</span>
                                }
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <select
                                  value={c.status || "applied"}
                                  onChange={e => updateStatus(c.application_id, e.target.value)}
                                  style={{ width: "auto", padding: "5px 8px", fontSize: 12 }}
                                >
                                  {["applied","reviewing","shortlisted","interview","rejected","hired"].map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                  ))}
                                </select>
                                {/* Email indicators */}
                                {c.status === 'shortlisted' && (
                                  <div style={{ fontSize: 10, color: "#1e8e3e", marginTop: 2 }}>✉ Shortlist email sent</div>
                                )}
                                {c.status === 'interview' && (
                                  <div style={{ fontSize: 10, color: "#1a73e8", marginTop: 2 }}>✉ Interview invite sent</div>
                                )}
                                {c.status === 'rejected' && (
                                  <div style={{ fontSize: 10, color: "#d93025", marginTop: 2 }}>✉ Rejection email sent</div>
                                )}
                                {c.status === 'hired' && (
                                  <div style={{ fontSize: 10, color: "#137333", marginTop: 2 }}>✉ Offer email sent</div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
