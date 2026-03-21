import { useState } from "react";
import apiFetch from "../api/index.js";
import { Btn } from "../components/index.jsx";

const STEPS = ["Your Details", "Upload Resume", "Your Skills", "Done"];

export default function CandidateOnboarding({ token, email, onComplete }) {
  const [step, setStep]               = useState(0);
  const [form, setForm]               = useState({ first_name: "", last_name: "", experience_years: 0 });
  const [resumeFile, setResumeFile]   = useState(null);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills]   = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Step 0 → 1: Save name & experience ─────────────────────────
  const saveDetails = async () => {
    if (!form.first_name.trim()) { setError("First name is required"); return; }
    setError("");
    setStep(1);
  };

  // ── Step 1 → 2: Upload resume & extract skills ──────────────────
  const uploadResume = async (skip = false) => {
    setLoading(true); setError("");

    if (skip) {
      // Skip resume — go straight to skills with empty suggestions
      setStep(2);
      setLoading(false);
      return;
    }

    if (!resumeFile) { setError("Please select a PDF file"); setLoading(false); return; }

    const fd = new FormData();
    fd.append("resume", resumeFile);
    fd.append("first_name", form.first_name);
    fd.append("last_name", form.last_name);
    fd.append("experience_years", form.experience_years);

    const d = await apiFetch.uploadFile("/accounts/candidate/onboarding/", fd, token);
    if (d.message) {
      const suggested = d.suggested_skills || [];
      setSuggestedSkills(suggested);
      setSelectedSkills(suggested); // pre-select all AI suggestions
      setStep(2);
    } else {
      setError(d.error || "Upload failed");
    }
    setLoading(false);
  };

  // ── Step 2 → 3: Save skills ─────────────────────────────────────
  const saveSkills = async () => {
    setLoading(true);
    const allSkills = [...new Set([...selectedSkills, ...(customSkill ? [customSkill] : [])])];
    const d = await apiFetch.post("/accounts/candidate/skills/", { skills: allSkills }, token);
    if (d.message) {
      setStep(3);
      setTimeout(() => onComplete({
        name: `${form.first_name} ${form.last_name}`.trim(),
      }), 1800);
    } else {
      setError(d.error || "Failed to save skills");
    }
    setLoading(false);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim().toLowerCase();
    if (!s) return;
    if (!selectedSkills.includes(s)) setSelectedSkills(prev => [...prev, s]);
    setCustomSkill("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f2f1", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Top bar */}
      <header style={{ background: "#e05c00", width: "100%", height: 58, display: "flex", alignItems: "center", padding: "0 32px" }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: -0.5 }}>
          Fit<span style={{ color: "#ffd5b0" }}>Jobs</span>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#e8e8e8" }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / STEPS.length) * 100}%`,
          background: "#e05c00", transition: "width .4s ease",
        }} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: 540 }}>

          {/* Step indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i <= step ? "#e05c00" : "#e0e0e0",
                  color: i <= step ? "#fff" : "#aaa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, transition: "all .3s",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i <= step ? "#e05c00" : "#aaa", fontWeight: i === step ? 700 : 400 }}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 24, height: 1, background: i < step ? "#e05c00" : "#e0e0e0", transition: "background .3s" }} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 0 — Details ── */}
          {step === 0 && (
            <div className="card" style={{ padding: "36px 40px", animation: "fadeIn .3s ease" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Let's set up your profile</h2>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
                Signed in as <b style={{ color: "#1a1a1a" }}>{email}</b>
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label>First Name *</label>
                  <input value={form.first_name} onChange={e => set("first_name", e.target.value)}
                    placeholder="First" onKeyDown={e => e.key === "Enter" && saveDetails()} autoFocus />
                </div>
                <div>
                  <label>Last Name</label>
                  <input value={form.last_name} onChange={e => set("last_name", e.target.value)}
                    placeholder="Last" onKeyDown={e => e.key === "Enter" && saveDetails()} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label>Years of Experience</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  {["0", "1", "2", "3", "4", "5", "6-8", "9-12", "12+"].map(yr => (
                    <button key={yr}
                      onClick={() => set("experience_years", yr === "12+" ? 15 : yr === "6-8" ? 7 : yr === "9-12" ? 10 : Number(yr))}
                      style={{
                        padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: String(form.experience_years) === (yr === "12+" ? "15" : yr === "6-8" ? "7" : yr === "9-12" ? "10" : yr) ? "#fff5ee" : "#fff",
                        border: `2px solid ${String(form.experience_years) === (yr === "12+" ? "15" : yr === "6-8" ? "7" : yr === "9-12" ? "10" : yr) ? "#e05c00" : "#e0e0e0"}`,
                        color: String(form.experience_years) === (yr === "12+" ? "15" : yr === "6-8" ? "7" : yr === "9-12" ? "10" : yr) ? "#e05c00" : "#555",
                        transition: "all .15s",
                      }}>
                      {yr} {yr === "0" ? "yrs" : yr === "1" ? "yr" : "yrs"}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={{ color: "#d93025", fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}
              <Btn onClick={saveDetails} full>Continue →</Btn>
            </div>
          )}

          {/* ── STEP 1 — Resume ── */}
          {step === 1 && (
            <div className="card" style={{ padding: "36px 40px", animation: "fadeIn .3s ease" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Upload your resume</h2>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
                We'll use AI to extract your skills automatically
              </p>

              <label style={{ cursor: "pointer", display: "block", marginBottom: 16 }}>
                <input type="file" accept=".pdf"
                  onChange={e => setResumeFile(e.target.files[0])}
                  style={{ display: "none" }} />
                <div style={{
                  border: `2px dashed ${resumeFile ? "#e05c00" : "#d4d2d0"}`,
                  borderRadius: 8, padding: "32px", textAlign: "center",
                  background: resumeFile ? "#fff5ee" : "#fafafa",
                  transition: "all .2s", cursor: "pointer",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>
                    {resumeFile ? "📄" : "📎"}
                  </div>
                  <div style={{ fontWeight: 600, color: resumeFile ? "#e05c00" : "#444", fontSize: 15 }}>
                    {resumeFile ? resumeFile.name : "Click to select your resume"}
                  </div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
                    PDF only · Max 4MB
                  </div>
                </div>
              </label>

              {error && <p style={{ color: "#d93025", fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Btn onClick={() => uploadResume(false)} disabled={!resumeFile || loading} full>
                  {loading ? "Analysing resume…" : "Upload & Extract Skills →"}
                </Btn>
                <button
                  onClick={() => uploadResume(true)}
                  style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "4px 0" }}
                >
                  Skip for now — I'll add skills manually
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 — Skills ── */}
          {step === 2 && (
            <div className="card" style={{ padding: "36px 40px", animation: "fadeIn .3s ease" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Your skills</h2>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
                {suggestedSkills.length > 0
                  ? `We found ${suggestedSkills.length} skills in your resume. Deselect any that don't apply, or add more.`
                  : "Add your skills to get matched with the right jobs."
                }
              </p>

              {/* AI suggested skills */}
              {suggestedSkills.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
                    ✨ Found in your resume
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {suggestedSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                          cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                          transition: "all .15s",
                          background: selectedSkills.includes(skill) ? "#fff5ee" : "#fff",
                          border: `2px solid ${selectedSkills.includes(skill) ? "#e05c00" : "#e0e0e0"}`,
                          color: selectedSkills.includes(skill) ? "#e05c00" : "#666",
                        }}
                      >
                        {selectedSkills.includes(skill) ? "✓ " : ""}{skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Manually added skills */}
              {selectedSkills.filter(s => !suggestedSkills.includes(s)).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
                    Added by you
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selectedSkills.filter(s => !suggestedSkills.includes(s)).map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                          cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                          background: "#e8f0fe", border: "2px solid #1a73e8",
                          color: "#1a73e8", transition: "all .15s",
                        }}
                      >
                        ✓ {skill} ×
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add custom skill */}
              <div style={{ marginBottom: 20 }}>
                <label>Add a skill</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={customSkill}
                    onChange={e => setCustomSkill(e.target.value)}
                    placeholder="e.g. React, SQL, Project Management…"
                    onKeyDown={e => e.key === "Enter" && addCustomSkill()}
                    style={{ flex: 1 }}
                  />
                  <Btn size="sm" variant="secondary" onClick={addCustomSkill}>Add</Btn>
                </div>
              </div>

              <div style={{ background: "#f3f2f1", borderRadius: 6, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#555" }}>
                <b>{selectedSkills.length}</b> skill{selectedSkills.length !== 1 ? "s" : ""} selected
              </div>

              {error && <p style={{ color: "#d93025", fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}

              <Btn onClick={saveSkills} disabled={loading} full>
                {loading ? "Saving…" : "Save & Go to Dashboard →"}
              </Btn>
            </div>
          )}

          {/* ── STEP 3 — Done ── */}
          {step === 3 && (
            <div className="card" style={{ padding: "60px 40px", animation: "fadeIn .3s ease", textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "#e6f4ea", margin: "0 auto 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32,
              }}>✓</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>You're all set!</h2>
              <p style={{ color: "#666", fontSize: 14 }}>
                Welcome to FitJobs, <b>{form.first_name}</b>.<br />
                Finding your best matches…
              </p>
              <div style={{ marginTop: 24, height: 4, background: "#e8e8e8", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#e05c00", borderRadius: 2, animation: "progressFill 1.8s linear forwards" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes progressFill { from { width: 0%; } to { width: 100%; } }
        .card { background: #fff; border: 1px solid #d4d2d0; border-radius: 8px; }
        label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        input, select, textarea { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #1a1a1a; background: #fff; border: 1px solid #c9cccf; border-radius: 4px; padding: 9px 12px; outline: none; width: 100%; transition: border-color .15s, box-shadow .15s; }
        input:focus, select:focus { border-color: #e05c00; box-shadow: 0 0 0 2px #e05c0020; }
        input::placeholder { color: #9aa0a6; }
      `}</style>
    </div>
  );
}
