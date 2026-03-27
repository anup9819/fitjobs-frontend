import { useEffect } from "react";

const termsSections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using FitJobs, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.",
  },
  {
    title: "Who May Use FitJobs",
    body: "FitJobs is intended for job seekers, employers, recruiters, and other authorized users who are at least 18 years old and legally capable of entering into binding agreements.",
  },
  {
    title: "Platform Purpose",
    body: "FitJobs provides a platform for candidates to discover job opportunities, create profiles, upload resumes, and apply for jobs, and for recruiters or employers to post jobs, review applicants, and manage hiring workflows. We may also provide AI-assisted recommendations, rankings, or profile insights to improve matching and hiring efficiency.",
  },
  {
    title: "Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate, current, and complete information and to keep it updated.",
  },
  {
    title: "Candidate Responsibilities",
    body: "Candidates must ensure that resumes, profile data, qualifications, certifications, work history, and other submitted information are truthful and not misleading. You must not impersonate another person or submit false applications.",
  },
  {
    title: "Recruiter and Employer Responsibilities",
    body: "Recruiters and employers are responsible for ensuring that all job postings, screening criteria, communications, and hiring decisions comply with applicable law. You may not post fraudulent, misleading, discriminatory, or unlawful job listings.",
  },
  {
    title: "Acceptable Use",
    body: "You agree not to misuse FitJobs. This includes attempting unauthorized access, scraping data without permission, distributing malware, interfering with platform performance, sending spam, harvesting personal information, posting unlawful or abusive content, or using the platform for any fraudulent purpose.",
  },
  {
    title: "AI Features and Recommendations",
    body: "FitJobs may provide AI-generated recommendations, rankings, summaries, or matching insights. These features are intended to support, not replace, human judgment. We do not guarantee that AI outputs are complete, accurate, unbiased, or suitable for any specific hiring or employment decision. Users remain responsible for reviewing and validating decisions made using platform outputs.",
  },
  {
    title: "User Content",
    body: "You retain ownership of the content you submit to FitJobs, including resumes, profile information, job descriptions, and other materials. By submitting content, you grant FitJobs a limited, non-exclusive license to host, store, process, display, and use that content as necessary to operate, improve, and provide the services.",
  },
  {
    title: "Job Listings and Applications",
    body: "FitJobs does not guarantee job availability, interview selection, hiring outcomes, candidate suitability, or the authenticity of every listing or applicant. We act as a platform provider and are not a party to employment agreements formed between candidates and employers.",
  },
  {
  title: "Fraud and Payments Disclaimer",
  body: "FitJobs does not charge candidates for job applications and does not authorize recruiters or employers to request payments from candidates for job opportunities. Users are advised not to make any payments to recruiters, employers, or third parties in connection with job opportunities listed on the platform. FitJobs is not responsible or liable for any loss, damage, fraud, misrepresentation, or financial harm resulting from interactions between users, including situations where a recruiter, employer, or third party requests payment, engages in fraudulent activity, or ceases communication. Users are encouraged to report any suspicious activity to FitJobs immediately."
  },
  {
    title: "Communications",
    body: "By using the platform, you agree that FitJobs may send account-related, service-related, verification, security, and application-related communications by email or other available channels.",
  },
  {
    title: "Termination or Suspension",
    body: "We may suspend, restrict, or terminate access to FitJobs at any time if we believe a user has violated these Terms, created risk for other users, provided false information, or used the platform unlawfully or abusively.",
  },
  {
    title: "Intellectual Property",
    body: "All platform software, branding, design, interfaces, and non-user-generated content on FitJobs are owned by or licensed to us and are protected by applicable intellectual property laws. You may not copy, reproduce, modify, distribute, or reverse engineer any part of the platform except as permitted by law.",
  },
  {
    title: "Third-Party Services",
    body: "FitJobs may integrate with or link to third-party services, including authentication, cloud storage, analytics, or communication tools. We are not responsible for the content, policies, availability, or practices of third-party services.",
  },
  {
    title: "Disclaimers",
    body: "FitJobs is provided on an 'as is' and 'as available' basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted access, error-free operation, successful hiring outcomes, or the accuracy of user-submitted or AI-generated content.",
  },
  {
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by law, FitJobs and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, business opportunities, or goodwill arising out of or related to your use of the platform.",
  },
  {
    title: "Changes to the Service or Terms",
    body: "We may update, modify, or discontinue parts of the platform or these Terms from time to time. Continued use of FitJobs after changes become effective constitutes acceptance of the updated Terms.",
  },
  {
    title: "Governing Law",
    body: "These Terms shall be governed by and interpreted in accordance with the laws applicable in your operating jurisdiction, unless otherwise required by mandatory local law.",
  },
  {
    title: "Contact",
    body: "If you have questions about these Terms, please contact us at: support@fitjobs.in",
  },
];


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
      <div
        style={{
          background: "#1a1a1a",
          padding: "56px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "#e05c0012",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "#e05c0008",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
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
          }}
        >
          Legal
        </div>

        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(26px, 5vw, 40px)",
            fontWeight: 800,
            marginBottom: 12,
            lineHeight: 1.15,
          }}
        >
          Privacy Policy & Terms of Service
        </h1>
        <p style={{ color: "#999", fontSize: 13, marginBottom: 4 }}>
          Effective Date: March 23, 2026
        </p>
        <p style={{ color: "#666", fontSize: 13, maxWidth: 520, margin: "0 auto" }}>
          FitJobs is committed to protecting your privacy and setting clear expectations for how the platform may be used.
        </p>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "1px solid #d4d2d0",
              borderRadius: 6,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#555",
              cursor: "pointer",
              marginBottom: 32,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back
          </button>
        )}

        <div
          style={{
            background: "#fff3ed",
            border: "1px solid #f5c4a0",
            borderRadius: 10,
            padding: "18px 22px",
            marginBottom: 32,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
          <p style={{ fontSize: 13, color: "#7a3800", lineHeight: 1.6 }}>
            <strong>Your data belongs to you.</strong> FitJobs ("we", "our", "us") operates{" "}
            <strong>www.fitjobs.in</strong>. We built this platform with privacy in mind and clear rules for platform use.
          </p>
        </div>

        {sections.map((sec, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #d4d2d0",
              borderRadius: 10,
              padding: "24px 28px",
              marginBottom: 16,
              animation: "fadeIn 0.3s ease both",
              animationDelay: `${i * 0.04}s`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <span
                style={{
                  background: "#f3f2f1",
                  color: "#e05c00",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #e8e6e4",
                  flexShrink: 0,
                }}
              >
                {sec.number}
              </span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{sec.title}</h2>
            </div>

            {sec.subsections &&
              sec.subsections.map((sub, j) => (
                <div key={j} style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 8 }}>
                    {sub.heading}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {sub.items.map((item, k) => (
                      <span
                        key={k}
                        style={{
                          background: "#f3f2f1",
                          border: "1px solid #e8e6e4",
                          borderRadius: 20,
                          padding: "3px 12px",
                          fontSize: 12,
                          color: "#555",
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            {sec.bullets && (
              <ul
                style={{
                  paddingLeft: 0,
                  marginBottom: sec.body || sec.highlight ? 14 : 0,
                  listStyle: "none",
                }}
              >
                {sec.bullets.map((b, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 13,
                      color: "#444",
                      lineHeight: 1.6,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#e05c00",
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {sec.highlight && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  borderRadius: 7,
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#166534",
                  marginBottom: sec.body ? 14 : 0,
                }}
              >
                ✓ {sec.highlight}
              </div>
            )}

            {sec.body && (
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                {sec.body}
              </p>
            )}

            {sec.contact && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {sec.contact.map((c, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#e05c00",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        minWidth: 60,
                      }}
                    >
                      {c.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#1a1a1a",
                        fontWeight: 600,
                        background: "#f3f2f1",
                        padding: "4px 12px",
                        borderRadius: 6,
                        border: "1px solid #e8e6e4",
                      }}
                    >
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 40, marginBottom: 24 }}>
          <div
            style={{
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
            }}
          >
            Terms
          </div>

          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 10,
            }}
          >
            Terms of Service
          </h2>

          <p style={{ color: "#666", fontSize: 13, maxWidth: 620, lineHeight: 1.7 }}>
            These terms govern your use of FitJobs as a candidate, recruiter, employer, or other authorized user.
          </p>
        </div>

        {termsSections.map((sec, i) => (
          <div
            key={`term-${i}`}
            style={{
              background: "#fff",
              border: "1px solid #d4d2d0",
              borderRadius: 10,
              padding: "24px 28px",
              marginBottom: 16,
              animation: "fadeIn 0.3s ease both",
              animationDelay: `${i * 0.04}s`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <span
                style={{
                  background: "#f3f2f1",
                  color: "#e05c00",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #e8e6e4",
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{sec.title}</h2>
            </div>

            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{sec.body}</p>
          </div>
        ))}

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#999",
            marginTop: 32,
          }}
        >
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

