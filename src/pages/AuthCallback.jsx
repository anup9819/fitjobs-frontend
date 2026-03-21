import { useEffect } from "react";

export default function AuthCallback({ onAuth }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access    = params.get("access");
    const refresh   = params.get("refresh");
    const usertype  = params.get("usertype");
    const company   = params.get("company");

    if (access && refresh && usertype) {
      onAuth(access, refresh, usertype, company || "");
    } else {
      // Something went wrong — go back to login
      window.location.href = "/";
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#f3f2f1",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 36, height: 36, border: "3px solid #e05c00",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 1s linear infinite", margin: "0 auto 16px",
        }} />
        <p style={{ color: "#666", fontSize: 14 }}>Signing you in…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}