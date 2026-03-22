import { useState, useEffect, useRef } from "react";
import apiFetch from "../api/index.js";

const API = "http://localhost:8000/api";

// ── OTP Input ─────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      if (next[i]) { next[i] = ""; onChange(next.join("")); }
      else if (i > 0) inputs.current[i - 1]?.focus();
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

const MsgBox = ({ msg }) => (
  <div style={{
    padding: "10px 14px", borderRadius: 4, fontSize: 13, fontWeight: 500,
    background: msg.type === "error" ? "#fce8e6" : "#e6f4ea",
    color: msg.type === "error" ? "#d93025" : "#1e8e3e",
    border: `1px solid ${msg.type === "error" ? "#d9302540" : "#1e8e3e40"}`,
  }}>{msg.text}</div>
);

export default function ForgotPassword({ onBack }) {
  const [step, setStep]             = useState("email"); // email | otp | newpass | done
  const [email, setEmail]           = useState("");
  const [otp, setOtp]               = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]       = useState(false);
  const [msg, setMsg]               = useState({ text: "", type: "" });
  const [countdown, setCountdown]   = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const sendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMsg({ text: "Please enter a valid email address", type: "error" }); return;
    }
    setLoading(true); setMsg({ text: "", type: "" });
    const d = await apiFetch.post("/accounts/forgot-password/", { email });
    setMsg({ text: d.message, type: "success" });
    setStep("otp");
    setCountdown(60);
    setLoading(false);
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setMsg({ text: "Please enter the 6-digit code", type: "error" }); return;
    }
    setLoading(true); setMsg({ text: "", type: "" });
    const d = await apiFetch.post("/accounts/verify-reset-otp/", { email, otp });
    if (d.reset_token) {
      setResetToken(d.reset_token);
      setStep("newpass");
      setMsg({ text: "", type: "" });
    } else {
      setMsg({ text: d.error || "Invalid code", type: "error" });
    }
    setLoading(false);
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setMsg({ text: "Password must be at least 8 characters", type: "error" }); return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ text: "Passwords don't match", type: "error" }); return;
    }
    setLoading(true); setMsg({ text: "", type: "" });
    const d = await apiFetch.post("/accounts/reset-password/", {
      email, reset_token: resetToken, new_password: newPassword,
    });
    if (d.message && !d.error) {
      setStep("done");
    } else {
      setMsg({ text: d.error || "Failed to reset password", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── STEP: Email ── */}
      {step === "email" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔐</div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>Forgot your password?</h3>
            <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
              Enter your email and we'll send a reset code
            </p>
          </div>
          <div>
            <label>Email Address</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyDown={e => e.key === "Enter" && sendOtp()}
              autoFocus
            />
          </div>
          {msg.text && <MsgBox msg={msg} />}
          <button
            onClick={sendOtp}
            disabled={loading}
            style={{
              width: "100%", padding: "10px 20px",
              background: loading ? "#f0f0f0" : "#e05c00",
              color: loading ? "#aaa" : "#fff",
              border: "2px solid #e05c00", borderRadius: 4,
              fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {loading ? "Sending…" : "Send Reset Code"}
          </button>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ← Back to Sign In
          </button>
        </div>
      )}

      {/* ── STEP: OTP ── */}
      {step === "otp" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📧</div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>Check your email</h3>
            <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
              We sent a 6-digit code to<br />
              <b style={{ color: "#1a1a1a" }}>{email}</b>
            </p>
          </div>
          <OtpInput value={otp} onChange={setOtp} />
          {msg.text && <MsgBox msg={msg} />}
          <button
            onClick={verifyOtp}
            disabled={loading || otp.length !== 6}
            style={{
              width: "100%", padding: "10px 20px",
              background: (loading || otp.length !== 6) ? "#f0f0f0" : "#e05c00",
              color: (loading || otp.length !== 6) ? "#aaa" : "#fff",
              border: "2px solid #e05c00", borderRadius: 4,
              fontWeight: 700, fontSize: 14,
              cursor: (loading || otp.length !== 6) ? "not-allowed" : "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: (loading || otp.length !== 6) ? 0.6 : 1,
            }}
          >
            {loading ? "Verifying…" : "Verify Code"}
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "#666" }}>
            Didn't receive it?{" "}
            {countdown > 0
              ? <span style={{ color: "#aaa" }}>Resend in {countdown}s</span>
              : <span onClick={sendOtp} style={{ color: "#e05c00", cursor: "pointer", fontWeight: 600 }}>Resend code</span>
            }
          </p>
          <button
            onClick={() => { setStep("email"); setOtp(""); setMsg({ text: "", type: "" }); }}
            style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ← Change email
          </button>
        </div>
      )}

      {/* ── STEP: New Password ── */}
      {step === "newpass" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔑</div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>Set new password</h3>
            <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Choose a strong password</p>
          </div>
          <div>
            <label>New Password</label>
            <input
              type="password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min 8 characters"
              onKeyDown={e => e.key === "Enter" && resetPassword()}
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              onKeyDown={e => e.key === "Enter" && resetPassword()}
            />
          </div>

          {/* Password strength indicator */}
          {newPassword && (
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: newPassword.length >= i * 3
                      ? i <= 1 ? "#d93025" : i <= 2 ? "#f29900" : i <= 3 ? "#1a73e8" : "#1e8e3e"
                      : "#e0e0e0",
                    transition: "background .2s",
                  }} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#888" }}>
                {newPassword.length < 6 ? "Too short" : newPassword.length < 9 ? "Fair" : newPassword.length < 12 ? "Good" : "Strong"}
              </p>
            </div>
          )}

          {msg.text && <MsgBox msg={msg} />}
          <button
            onClick={resetPassword}
            disabled={loading}
            style={{
              width: "100%", padding: "10px 20px",
              background: loading ? "#f0f0f0" : "#e05c00",
              color: loading ? "#aaa" : "#fff",
              border: "2px solid #e05c00", borderRadius: 4,
              fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </div>
      )}

      {/* ── STEP: Done ── */}
      {step === "done" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#e6f4ea", margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28,
          }}>✓</div>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a", marginBottom: 8 }}>
            Password reset!
          </h3>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>
            Your password has been updated. You can now sign in.
          </p>
          <button
            onClick={onBack}
            style={{
              padding: "10px 28px", background: "#e05c00", color: "#fff",
              border: "none", borderRadius: 4, fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Sign In →
          </button>
        </div>
      )}
    </div>
  );
}
