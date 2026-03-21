import { useState, useEffect, useRef } from "react";
import apiFetch, { API } from "../api/index.js";
import globalStyles from "../styles/global.js";
import { Btn } from "../components/index.jsx";

// ── OTP Input — 6 boxes ───────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      if (next[i]) {
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
      }
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = [...digits];
    next[i] = e.key;
    onChange(next.join(""));
    if (i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "8px 0" }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          value={d}
          onChange={() => {}}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          maxLength={1}
          style={{
            width: 44, height: 52, textAlign: "center",
            fontSize: 22, fontWeight: 700,
            border: `2px solid ${d ? "#e05c00" : "#d4d2d0"}`,
            borderRadius: 8, outline: "none",
            background: d ? "#fff5ee" : "#fff",
            transition: "all .15s",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onFocus={e => e.target.style.borderColor = "#e05c00"}
          onBlur={e => e.target.style.borderColor = d ? "#e05c00" : "#d4d2d0"}
        />
      ))}
    </div>
  );
};

// ── Small shared components ───────────────────────────────────────
const MsgBox = ({ msg }) => (
  <div style={{
    padding: "10px 14px", borderRadius: 4, fontSize: 13, fontWeight: 500,
    background: msg.type === "error" ? "#fce8e6" : "#e6f4ea",
    color: msg.type === "error" ? "#d93025" : "#1e8e3e",
    border: `1px solid ${msg.type === "error" ? "#d9302540" : "#1e8e3e40"}`,
  }}>{msg.text}</div>
);

const Divider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
    <span style={{ color: "#aaa", fontSize: 12, fontWeight: 600 }}>OR</span>
    <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
  </div>
);

const GoogleBtn = () => (
  <button
    onClick={() => window.location.href = "http://localhost:8000/accounts/google/login/"}
    style={{
      width: "100%", padding: "10px 20px",
      background: "#fff", border: "1.5px solid #dadce0", borderRadius: 4,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 14, fontWeight: 600, color: "#3c4043",
      transition: "background .15s, box-shadow .15s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "#f8f9fa"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
    Continue with Google
  </button>
);

// ── Main AuthScreen ───────────────────────────────────────────────
export default function AuthScreen({ onAuth }) {
  const [mode, setMode]         = useState("login");
  const [regStep, setRegStep]   = useState("form"); // "form" | "otp"
  const [form, setForm]         = useState({ email: "", password: "", user_type: "candidate" });
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState({ text: "", type: "" });
  const [countdown, setCountdown] = useState(0);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Countdown for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e);

  // ── Send OTP ─────────────────────────────────────────────────
  const sendOtp = async () => {
    if (!validateEmail(form.email)) {
      setMsg({ text: "Please enter a valid email address", type: "error" }); return;
    }
    if (!form.password || form.password.length < 8) {
      setMsg({ text: "Password must be at least 8 characters", type: "error" }); return;
    }
    setLoading(true); setMsg({ text: "", type: "" });
    const d = await apiFetch.post("/accounts/send-otp/", { email: form.email });
    if (d.message) {
      setRegStep("otp");
      setCountdown(60);
      setMsg({ text: `Code sent to ${form.email}`, type: "success" });
    } else {
      setMsg({ text: d.error || "Failed to send code", type: "error" });
    }
    setLoading(false);
  };

  // ── Verify OTP & Register ─────────────────────────────────────
  const verifyAndRegister = async () => {
    if (otp.length !== 6) {
      setMsg({ text: "Please enter the 6-digit code", type: "error" }); return;
    }
    setLoading(true); setMsg({ text: "", type: "" });
    const d = await apiFetch.post("/accounts/register/", {
      email: form.email,
      password: form.password,
      user_type: form.user_type,
      otp,
    });
    if (d.message) {
      setMode("login");
      setRegStep("form");
      setOtp("");
      setMsg({ text: "✓ Account created! Sign in below.", type: "success" });
    } else {
      setMsg({ text: d.error || "Invalid code", type: "error" });
    }
    setLoading(false);
  };

  // ── Login ─────────────────────────────────────────────────────
  const login = async () => {
    if (!form.email || !form.password) {
      setMsg({ text: "Please fill all fields", type: "error" }); return;
    }
    setLoading(true); setMsg({ text: "", type: "" });
    try {
      const d = await apiFetch.post("/accounts/login/", {
        email: form.email,
        password: form.password,
      });
      if (d.access) {
        onAuth(d.access, d.refresh, d.usertype, d.company_name || "");
      } else {
        setMsg({ text: d.error || "Invalid email or password", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error. Is the server running?", type: "error" });
    }
    setLoading(false);
  };

  const switchMode = (m) => {
    setMode(m); setRegStep("form");
    setMsg({ text: "", type: "" }); setOtp("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f2f1", display: "flex", flexDirection: "column" }}>
      <style>{globalStyles}</style>

      {/* Header */}
      <div style={{ background: "#e05c00", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 56, display: "flex", alignItems: "center" }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff" }}>
            Fit<span style={{ color: "#ffd5b0" }}>Jobs</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "#e05c00", paddingBottom: 56 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: -1, lineHeight: 1.15 }}>
            Work <span style={{ fontStyle: "italic", color: "#ffd5b0" }}>[Rethought]</span>
          </h1>
          <p style={{ color: "#ffe8d6", fontSize: 15, marginTop: 10 }}>
            Powered by technology, built for people
          </p>
        </div>
      </div>

      {/* Card */}
      <div style={{ maxWidth: 440, width: "100%", margin: "-32px auto 0", padding: "0 16px", animation: "fadeIn .4s ease" }}>
        <div className="card" style={{ padding: "28px 32px", boxShadow: "0 4px 24px rgba(0,0,0,.12)" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "2px solid #e0e0e0", marginBottom: 24 }}>
            {[["login", "Sign In"], ["register", "Create Account"]].map(([m, l]) => (
              <button key={m} onClick={() => switchMode(m)} style={{
                background: "none", border: "none",
                borderBottom: mode === m ? "2px solid #e05c00" : "2px solid transparent",
                marginBottom: -2, color: mode === m ? "#e05c00" : "#666",
                fontWeight: mode === m ? 700 : 500,
                fontSize: 14, padding: "0 0 12px 0", marginRight: 24,
                cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>{l}</button>
            ))}
          </div>

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label>Email Address</label>
                <input type="email" value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com"
                  onKeyDown={e => e.key === "Enter" && login()} />
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="Enter your password"
                  onKeyDown={e => e.key === "Enter" && login()} />
              </div>
              {msg.text && <MsgBox msg={msg} />}
              <Btn onClick={login} disabled={loading} full>
                {loading ? "Signing in…" : "Sign In"}
              </Btn>
              <Divider />
              <GoogleBtn />
              <p style={{ textAlign: "center", color: "#666", fontSize: 13 }}>
                Don't have an account?{" "}
                <span onClick={() => switchMode("register")} style={{ color: "#e05c00", cursor: "pointer", fontWeight: 600 }}>
                  Sign up free
                </span>
              </p>
            </div>
          )}

          {/* ── REGISTER STEP 1 — Details form ── */}
          {mode === "register" && regStep === "form" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label>Email Address</label>
                <input type="email" value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com"
                  onKeyDown={e => e.key === "Enter" && sendOtp()} />
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="Min 8 characters"
                  onKeyDown={e => e.key === "Enter" && sendOtp()} />
              </div>
              <div>
                <label>I am looking to</label>
                <select value={form.user_type} onChange={e => set("user_type", e.target.value)}>
                  <option value="candidate">Find a job (Candidate)</option>
                  <option value="recruiter">Hire talent (Recruiter)</option>
                </select>
              </div>
              {msg.text && <MsgBox msg={msg} />}
              <Btn onClick={sendOtp} disabled={loading} full>
                {loading ? "Sending code…" : "Send Verification Code →"}
              </Btn>
              <Divider />
              <GoogleBtn />
            </div>
          )}

          {/* ── REGISTER STEP 2 — OTP entry ── */}
          {mode === "register" && regStep === "otp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📧</div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Check your email</p>
                <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
                  We sent a 6-digit code to<br />
                  <b style={{ color: "#1a1a1a" }}>{form.email}</b>
                </p>
              </div>

              <OtpInput value={otp} onChange={setOtp} />

              {msg.text && <MsgBox msg={msg} />}

              <Btn onClick={verifyAndRegister} disabled={loading || otp.length !== 6} full>
                {loading ? "Verifying…" : "Verify & Create Account"}
              </Btn>

              <p style={{ textAlign: "center", fontSize: 13, color: "#666" }}>
                Didn't receive it?{" "}
                {countdown > 0
                  ? <span style={{ color: "#aaa" }}>Resend in {countdown}s</span>
                  : <span onClick={sendOtp} style={{ color: "#e05c00", cursor: "pointer", fontWeight: 600 }}>
                      Resend code
                    </span>
                }
              </p>

              <button
                onClick={() => { setRegStep("form"); setOtp(""); setMsg({ text: "", type: "" }); }}
                style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                ← Change email
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 28, color: "#888", fontSize: 13, fontWeight: 500 }}>
          Better matches. Better careers.
        </p>
      </div>
    </div>
  );
}
