import { useState } from "react";
import apiFetch from "../api/index.js";
import { Btn } from "../components/index.jsx";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education",
  "E-commerce", "Manufacturing", "Media", "Consulting",
  "Real Estate", "Other"
];

const STEPS = ["Company Info", "Industry & Size", "Done"];

export default function RecruiterOnboarding({ token, onComplete }) {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({ company_name: "", industry: "", size: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const next = () => {
    if (step === 0 && !form.company_name.trim()) {
      setError("Please enter your company name"); return;
    }
    setError("");
    setStep(s => s + 1);
  };

  const handle = async () => {
    setLoading(true);
    const d = await apiFetch.post("/accounts/recruiter/profile/", form, token);
    if (d.message) {
      setStep(2);
      setTimeout(() => onComplete(form.company_name), 1800);
    } else {
      setError(d.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f2f1", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Top bar — full width, same as Topbar component */}
      <header style={{ background: "#e05c00", width: "100%", borderBottom: "none" }}>
        <div style={{ maxWidth: "100%", padding: "0 32px", height: 58, display: "flex", alignItems: "center" }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: -0.5 }}>
            Fit<span style={{ color: "#ffd5b0" }}>Jobs</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#e8e8e8" }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / STEPS.length) * 100}%`,
          background: "#e05c00",
          transition: "width .4s ease",
        }} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          {/* Step indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i <= step ? "#e05c00" : "#e0e0e0",
                  color: i <= step ? "#fff" : "#aaa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                  transition: "all .3s ease",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i <= step ? "#e05c00" : "#aaa", fontWeight: i === step ? 700 : 400 }}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 32, height: 1, background: i < step ? "#e05c00" : "#e0e0e0", transition: "background .3s" }} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 0 — Company Name ── */}
          {step === 0 && (
            <div style={{ animation: "fadeIn .3s ease" }}>
              <div className="card" style={{ padding: "40px", boxShadow: "0 2px 16px rgba(0,0,0,.08)", borderRadius: 8 }}>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    What's your company called?
                  </h2>
                  <p style={{ color: "#888", fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>This will appear on all your job listings</p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Company Name *</label>
                  <input
                    value={form.company_name}
                    onChange={e => set("company_name", e.target.value)}
                    placeholder="e.g. Acme Technologies"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, padding: "10px 12px", width: "100%" }}
                    onKeyDown={e => e.key === "Enter" && next()}
                    autoFocus
                  />
                </div>

                {error && <div style={{ color: "#d93025", fontSize: 13, marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>⚠ {error}</div>}

                <Btn onClick={next} full>Continue →</Btn>
              </div>

              <div style={{ textAlign: "center", marginTop: 24, color: "#bbb", fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                🏢 Join hundreds of companies hiring on FitJobs
              </div>
            </div>
          )}

          {/* ── STEP 1 — Industry & Size ── */}
          {step === 1 && (
            <div style={{ animation: "fadeIn .3s ease" }}>
              <div className="card" style={{ padding: "40px 40px 32px", boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 6 }}>
                    Tell us more about <span style={{ color: "#e05c00" }}>{form.company_name}</span>
                  </h2>
                  <p style={{ color: "#888", fontSize: 14 }}>Helps candidates find the right fit</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label>Industry</label>
                  <select value={form.industry} onChange={e => set("industry", e.target.value)}>
                    <option value="">Select your industry…</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label>Company Size</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 4 }}>
                    {["1–10", "11–50", "51–200", "201–500", "500–1000", "1000+"].map(size => (
                      <button
                        key={size}
                        onClick={() => set("size", size)}
                        style={{
                          padding: "10px 0", borderRadius: 6, fontSize: 13, fontWeight: 600,
                          cursor: "pointer", transition: "all .15s",
                          background: form.size === size ? "#fff5ee" : "#fff",
                          border: `2px solid ${form.size === size ? "#e05c00" : "#e0e0e0"}`,
                          color: form.size === size ? "#e05c00" : "#555",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <div style={{ color: "#d93025", fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="secondary" onClick={() => setStep(0)}>← Back</Btn>
                  <Btn onClick={handle} disabled={loading} full size="lg">
                    {loading ? "Setting up…" : "Go to Dashboard →"}
                  </Btn>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 — Success ── */}
          {step === 2 && (
            <div style={{ animation: "fadeIn .3s ease" }}>
              <div className="card" style={{ padding: "60px 40px", boxShadow: "0 4px 24px rgba(0,0,0,.08)", textAlign: "center" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "#e6f4ea", margin: "0 auto 20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32,
                }}>
                  ✓
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>
                  You're all set!
                </h2>
                <p style={{ color: "#666", fontSize: 14 }}>
                  Welcome to FitJobs, <b>{form.company_name}</b>.<br />
                  Taking you to your dashboard…
                </p>
                <div style={{
                  marginTop: 24, height: 4, background: "#e8e8e8", borderRadius: 2, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", background: "#e05c00", borderRadius: 2,
                    animation: "progressFill 1.8s linear forwards",
                  }} />
                </div>
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
        input, select { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #1a1a1a; background: #fff; border: 1px solid #c9cccf; border-radius: 4px; padding: 9px 12px; outline: none; width: 100%; transition: border-color .15s, box-shadow .15s; }
        input:focus, select:focus { border-color: #e05c00; box-shadow: 0 0 0 2px #e05c0020; }
        input::placeholder { color: #9aa0a6; }
      `}</style>
    </div>
  );
}