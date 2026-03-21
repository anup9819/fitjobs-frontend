import { useState } from "react";

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export const Btn = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  full,
  style: ex = {},
}) => {
  const variants = {
    primary:   { background: "#e05c00", color: "#fff",    border: "2px solid #e05c00" },
    secondary: { background: "#fff",    color: "#1a1a1a", border: "2px solid #c9cccf" },
    outline:   { background: "#fff",    color: "#e05c00", border: "2px solid #e05c00" },
    ghost:     { background: "transparent", color: "#555", border: "2px solid transparent" },
  };
  const sizes = {
    sm: { padding: "5px 14px",  fontSize: 13 },
    md: { padding: "9px 20px",  fontSize: 14 },
    lg: { padding: "12px 28px", fontSize: 15 },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(0.92)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: 4,
        fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        transition: "filter .15s",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        ...ex,
      }}
    >
      {children}
    </button>
  );
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
export const Toast = ({ msg, type }) => (
  <div style={{
    position: "fixed", bottom: 24, right: 24, zIndex: 9999,
    background: type === "error" ? "#d93025" : "#1e8e3e",
    color: "#fff", borderRadius: 6, padding: "12px 20px",
    fontSize: 14, fontWeight: 600,
    boxShadow: "0 4px 16px rgba(0,0,0,.2)",
    animation: "fadeIn .2s ease",
    display: "flex", gap: 8, alignItems: "center",
  }}>
    {type === "error" ? "✕" : "✓"} {msg}
  </div>
);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_META = {
  applied:     { bg: "#e8f0fe", color: "#1a73e8", label: "Applied" },
  reviewing:   { bg: "#fef7e0", color: "#f29900", label: "Reviewing" },
  shortlisted: { bg: "#e6f4ea", color: "#1e8e3e", label: "Shortlisted" },
  interview:   { bg: "#e8f0fe", color: "#1967d2", label: "Interview" },
  rejected:    { bg: "#fce8e6", color: "#d93025", label: "Rejected" },
  hired:       { bg: "#e6f4ea", color: "#137333", label: "Hired" },
};

export const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.applied;
  return (
    <span style={{
      background: m.bg, color: m.color,
      border: `1px solid ${m.color}30`,
      borderRadius: 4, padding: "2px 8px",
      fontSize: 12, fontWeight: 700,
    }}>
      {m.label}
    </span>
  );
};

// ─── SCORE BAR ────────────────────────────────────────────────────────────────
export const ScoreBar = ({ score }) => {
  const color = score >= 70 ? "#1e8e3e" : score >= 40 ? "#f29900" : "#d93025";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#e8e8e8", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${Math.min(score, 100)}%`, height: "100%",
          background: color, borderRadius: 3,
          transition: "width .6s ease",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36 }}>
        {Math.round(score)}%
      </span>
    </div>
  );
};

// ─── SPINNER ─────────────────────────────────────────────────────────────────
export const Spinner = ({ color = "#e05c00", label = "Loading…" }) => (
  <div style={{ textAlign: "center", padding: 80, color: "#888" }}>
    <div style={{
      width: 32, height: 32,
      border: `3px solid ${color}`,
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 12px",
    }} />
    {label}
  </div>
);

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
export const Empty = ({ icon = "🔍", title, subtitle, action }) => (
  <div className="card" style={{ padding: 60, textAlign: "center" }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <p style={{ fontWeight: 600, color: "#444", fontSize: 16 }}>{title}</p>
    {subtitle && <p style={{ color: "#888", marginTop: 4 }}>{subtitle}</p>}
    {action && <div style={{ marginTop: 20 }}>{action}</div>}
  </div>
);

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
export const Topbar = ({ userType, onLogout, page, setPage }) => {
  const links = userType === "candidate"
    ? [["Find Jobs", "jobs"], ["Recommended", "recommended"], ["My Applications", "applications"], ["Dashboard", "dashboard"]]
    : [["My Jobs", "my_jobs"], ["Dashboard", "recruiter_dashboard"]];

  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #d4d2d0",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        height: 58, display: "flex", alignItems: "center",
      }}>
        {/* Logo and button*/}
        <button
          onClick={() => setPage(links[0][1])}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: 22,
            color: "#e05c00", letterSpacing: -0.5,
            marginRight: 32, flexShrink: 0,
            background: "none", border: "none",
            cursor: "pointer", padding: 0,
          }}
        >
          Fit<span style={{ color: "#1a1a1a" }}>Jobs</span>
        </button>

        {/* Nav */}
        <nav style={{ display: "flex", flex: 1 }}>
          {links.map(([label, key]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              style={{
                background: "none", border: "none",
                borderBottom: page === key ? "3px solid #e05c00" : "3px solid transparent",
                marginBottom: -1,
                color: page === key ? "#e05c00" : "#444",
                fontWeight: page === key ? 700 : 500,
                fontSize: 14, padding: "0 16px", height: 58,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "color .15s",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>
            {userType === "candidate" ? "👤 Candidate" : "🏢 Recruiter"}
          </span>
          <Btn variant="secondary" size="sm" onClick={onLogout}>Sign Out</Btn>
        </div>
      </div>
    </header>
  );
};

// ─── JOB CARD ─────────────────────────────────────────────────────────────────
export const JobCard = ({ job, onApply, applied, score, delay = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  const jtColors = {
    "full-time":  "#1a73e8",
    "part-time":  "#9334e6",
    "contract":   "#e37400",
    "internship": "#1e8e3e",
    "remote":     "#188038",
  };
  const jtc = jtColors[job.job_type?.toLowerCase()] || "#444";

  const isExternal = job.apply_type === "external" && job.external_apply_url;

  return (
    <div className="job-card" style={{ animationDelay: `${delay}s` }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

        {/* Company avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: 6, flexShrink: 0,
          background: "#fff5ee", border: "1px solid #ffd5b0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800, color: "#e05c00",
        }}>
          {job.recruiter_name?.[0]?.toUpperCase() || "C"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a5276", marginBottom: 2 }}>{job.title}</h3>
                {/* External badge */}
                {isExternal && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 7px",
                    borderRadius: 20, background: "#e8f0fe", color: "#1a73e8",
                    border: "1px solid #1a73e840", letterSpacing: .3,
                  }}>
                    COMPANY SITE ↗
                  </span>
                )}
              </div>
              <div style={{ fontSize: 14, color: "#444", fontWeight: 500 }}>{job.recruiter_name}</div>
            </div>
            {score !== undefined && (
              <div style={{ minWidth: 150 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Match Score</div>
                <ScoreBar score={score} />
              </div>
            )}
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", fontSize: 13, color: "#555" }}>
            <span>📍 {job.location}</span>
            <span style={{ color: jtc, fontWeight: 600 }}>● {job.job_type}</span>
            {job.salary_visible && job.salary_min && (
              <span>₹{(job.salary_min / 100000).toFixed(1)}L–{(job.salary_max / 100000).toFixed(1)}L/yr</span>
            )}
            <span>🧭 {job.experience_min}–{job.experience_max} yrs</span>
            <span style={{ color: "#999" }}>
              {job.days_since_posted === 0 ? "Today" : `${job.days_since_posted}d ago`}
            </span>
          </div>

          {/* Skills */}
          {job.required_skills?.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {job.required_skills.slice(0, 6).map(s => (
                <span key={s} className="pill">{s}</span>
              ))}
              {job.required_skills.length > 6 && (
                <span style={{ fontSize: 12, color: "#888", alignSelf: "center" }}>
                  +{job.required_skills.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
            {onApply && (
              isExternal ? (
                // External — open company careers page in new tab
                <a
                  href={job.external_apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#1a5276", color: "#fff",
                    padding: "5px 14px", borderRadius: 4,
                    fontSize: 13, fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-flex", alignItems: "center", gap: 5,
                    transition: "filter .15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "none"}
                >
                  Apply on Company Site ↗
                </a>
              ) : applied ? (
                // Already applied on platform
                <span style={{ fontSize: 13, color: "#1e8e3e", fontWeight: 700 }}>✓ Applied</span>
              ) : (
                // Apply on platform
                <Btn size="sm" onClick={() => onApply(job.id)}>Apply Now</Btn>
              )
            )}
            <Btn
              variant="ghost" size="sm"
              onClick={() => setExpanded(!expanded)}
              style={{ color: "#1a5276", fontWeight: 600 }}
            >
              {expanded ? "▲ Less" : "▾ Job Details"}
            </Btn>
          </div>
        </div>
      </div>

      {/* Expanded description */}
      {expanded && (
        <div style={{
          marginTop: 16, paddingTop: 16, borderTop: "1px solid #e8e8e8",
          animation: "slideDown .2s ease",
        }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>
            About the Role
          </h4>
          <p style={{ color: "#333", fontSize: 14, lineHeight: 1.7 }}>
            {job.description || "No description provided."}
          </p>
          {/* Show external link in expanded view too */}
          {isExternal && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#e8f0fe", borderRadius: 6, fontSize: 13, color: "#1a5276" }}>
              ℹ This job is managed externally.{" "}
              <a href={job.external_apply_url} target="_blank" rel="noopener noreferrer"
                style={{ color: "#1a5276", fontWeight: 700 }}>
                View on company site ↗
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
