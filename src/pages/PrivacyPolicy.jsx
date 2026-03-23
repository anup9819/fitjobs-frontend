import { useEffect } from "react";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    subsections: [
      {
        heading: "Personal Information",
        items: ["Name", "Email address", "Phone number", "Resume / CV details", "Account credentials"],
      },
      {
        heading: "Employer Information",
        items: ["Company name", "Job postings", "Contact details"],
      },
      {
        heading: "Automatically Collected Data",
        items: ["IP address", "Browser type", "Device information", "Usage data (pages visited, clicks)"],
      },
    ],
  },
  {
    number: "02",
    title: "How We Use Your Information",
    bullets: [
      "Create and manage accounts",
      "Connect job seekers with employers",
      "Send notifications (job alerts, updates)",
      "Improve platform performance",
      "Prevent fraud and misuse",
    ],
  },
  {
    number: "03",
    title: "Sharing of Information",
    bullets: [
      "Employers — when you apply for a job",
      "Service providers — hosting, analytics, email services",
      "Legal authorities — if required by law",
    ],
    highlight: "We do NOT sell your personal data.",
  },
  {
    number: "04",
    title: "Data Security",
    body: "We implement reasonable security measures to protect your data. However, no system is 100% secure. We continuously work to improve our security practices to keep your information safe.",
  },
  {
    number: "05",
    title: "Cookies",
    bullets: [
      "Enhance user experience",
      "Track usage patterns",
      "Improve services",
    ],
    body: "You can disable cookies via your browser settings at any time.",
  },
  {
    number: "06",
    title: "Your Rights",
    bullets: [
      "Access your personal data",
      "Request correction or deletion",
      "Withdraw consent at any time",
    ],
    body: "To exercise any of these rights, contact us at support@fitjobs.in",
  },
  {
    number: "07",
    title: "Data Retention",
    bullets: [
      "Account functionality",
      "Legal compliance",
      "Business purposes",
    ],
    body: "We retain your data only as long as necessary for the above purposes.",
  },
  {
    number: "08",
    title: "Third-Party Links",
    body: "FitJobs may contain links to third-party websites. We are not responsible for their privacy practices or content. We encourage you to review the privacy policies of any third-party sites you visit.",
  },
  {
    number: "09",
    title: "Children's Privacy",
    body: "FitJobs is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us data, we will delete it promptly.",
  },
  {
    number: "10",
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Continued use of the platform following any changes constitutes your acceptance of the updated policy. We will always display the effective date at the top of this page.",
  },
  {
    number: "11",
    title: "Contact Us",
    body: "If you have any questions or concerns about this Privacy Policy, please reach out:",
    contact: [
      { label: "Email", value: "support@fitjobs.in" },
      { label: "Platform", value: "www.fitjobs.in" },
    ],
  },
];

export default function PrivacyPolicy({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f2f1", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "#1a1a1a",
        padding: "56px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: "#e05c0012", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "#e05c0008", pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-block",
          background: "#e05c0020",
          color: "#e05c00",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "5px 14px",
          borderRadius: 20,
          marginBottom: 18,
          border: "1px solid #e05c0030",
        }}>
          Legal
        </div>

        <h1 style={{
          color: "#fff",
          fontSize: "clamp(26px, 5vw, 40px)",
          fontWeight: 800,
          marginBottom: 12,
          lineHeight: 1.15,
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#999", fontSize: 13, marginBottom: 4 }}>
          Effective Date: March 23, 2026
        </p>
        <p style={{ color: "#666", fontSize: 13, maxWidth: 520, margin: "0 auto" }}>
          FitJobs is committed to protecting your privacy. This policy explains
          how we collect, use, and safeguard your information.
        </p>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* back button */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "none", border: "1px solid #d4d2d0",
              borderRadius: 6, padding: "7px 16px",
              fontSize: 13, fontWeight: 600, color: "#555",
              cursor: "pointer", marginBottom: 32,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← Back
          </button>
        )}

        {/* intro card */}
        <div style={{
          background: "#fff3ed",
          border: "1px solid #f5c4a0",
          borderRadius: 10,
          padding: "18px 22px",
          marginBottom: 32,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
          <p style={{ fontSize: 13, color: "#7a3800", lineHeight: 1.6 }}>
            <strong>Your data belongs to you.</strong> FitJobs ("we", "our", "us") operates{" "}
            <strong>www.fitjobs.in</strong>. We built this platform with privacy in mind —
            we never sell your personal data to anyone.
          </p>
        </div>

        {/* sections */}
        {sections.map((sec, i) => (
          <div key={i} style={{
            background: "#fff",
            border: "1px solid #d4d2d0",
            borderRadius: 10,
            padding: "24px 28px",
            marginBottom: 16,
            animation: "fadeIn 0.3s ease both",
            animationDelay: `${i * 0.04}s`,
          }}>
            {/* section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <span style={{
                background: "#f3f2f1",
                color: "#e05c00",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid #e8e6e4",
                flexShrink: 0,
              }}>
                {sec.number}
              </span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>
                {sec.title}
              </h2>
            </div>

            {/* subsections */}
            {sec.subsections && sec.subsections.map((sub, j) => (
              <div key={j} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 8 }}>
                  {sub.heading}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {sub.items.map((item, k) => (
                    <span key={k} style={{
                      background: "#f3f2f1",
                      border: "1px solid #e8e6e4",
                      borderRadius: 20,
                      padding: "3px 12px",
                      fontSize: 12,
                      color: "#555",
                      fontWeight: 500,
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* bullet list */}
            {sec.bullets && (
              <ul style={{ paddingLeft: 0, marginBottom: sec.body || sec.highlight ? 14 : 0, listStyle: "none" }}>
                {sec.bullets.map((b, j) => (
                  <li key={j} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    fontSize: 13, color: "#444", lineHeight: 1.6,
                    marginBottom: 6,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#e05c00", flexShrink: 0, marginTop: 7,
                    }} />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* highlight box */}
            {sec.highlight && (
              <div style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: 7,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: "#166534",
                marginBottom: sec.body ? 14 : 0,
              }}>
                ✓ {sec.highlight}
              </div>
            )}

            {/* body text */}
            {sec.body && (
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                {sec.body}
              </p>
            )}

            {/* contact info */}
            {sec.contact && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {sec.contact.map((c, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#e05c00",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      minWidth: 60,
                    }}>
                      {c.label}
                    </span>
                    <span style={{
                      fontSize: 13, color: "#1a1a1a", fontWeight: 600,
                      background: "#f3f2f1", padding: "4px 12px",
                      borderRadius: 6, border: "1px solid #e8e6e4",
                    }}>
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* footer note */}
        <p style={{
          textAlign: "center", fontSize: 12, color: "#999", marginTop: 32,
        }}>
          © 2026 FitJobs · www.fitjobs.in · All rights reserved
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  );
}
