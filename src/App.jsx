import { useState, useEffect } from "react";
import globalStyles from "./styles/global.js";
import { Topbar } from "./components/index.jsx";

import AuthScreen           from "./pages/AuthScreen.jsx";
import AuthCallback         from "./pages/AuthCallback.jsx";
import JobsPage             from "./pages/JobsPage.jsx";
import RecommendedPage      from "./pages/RecommendedPage.jsx";
import ApplicationsPage     from "./pages/ApplicationsPage.jsx";
import CandidateDashboard   from "./pages/CandidateDashboard.jsx";
import RecruiterDashboard   from "./pages/RecruiterDashboard.jsx";
import RecruiterOnboarding  from "./pages/RecruiterOnboarding.jsx";
import CandidateOnboarding  from "./pages/CandidateOnboarding.jsx";
import MyJobsPage           from "./pages/MyJobsPage.jsx";

const API = "http://localhost:8000/api";

async function refreshAccessToken() {
  const refresh = localStorage.getItem("fj_refresh");
  if (!refresh) return null;
  try {
    const res = await fetch(`${API}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.access) {
      localStorage.setItem("fj_token", data.access);
      if (data.refresh) localStorage.setItem("fj_refresh", data.refresh);
      return data.access;
    }
  } catch { return null; }
  return null;
}

export default function App() {
  const [token, setToken]               = useState(() => localStorage.getItem("fj_token") || null);
  const [userType, setUserType]         = useState(() => localStorage.getItem("fj_usertype") || null);
  const [companySet, setCompanySet]     = useState(() => localStorage.getItem("fj_company") || null);
  const [candidateReady, setCandidateReady] = useState(() => localStorage.getItem("fj_candidate_ready") || null);
  const [page, setPage]                 = useState("jobs");
  const [checking, setChecking]         = useState(true);

  // ── On load: verify token + check profiles ────────────────────
  useEffect(() => {
    // Skip verify if this is the OAuth callback
    if (window.location.pathname === "/auth/callback") {
      setChecking(false);
      return;
    }

    const verify = async () => {
      const storedToken = localStorage.getItem("fj_token");
      if (!storedToken) { setChecking(false); return; }

      let activeToken = storedToken;

      let res = await fetch(`${API}/accounts/user-type/`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (res.status === 401) {
        activeToken = await refreshAccessToken();
        if (!activeToken) {
          ["fj_token","fj_refresh","fj_usertype","fj_company","fj_candidate_ready"].forEach(k => localStorage.removeItem(k));
          setToken(null); setUserType(null); setCompanySet(null); setCandidateReady(null);
          setChecking(false); return;
        }
        res = await fetch(`${API}/accounts/user-type/`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
      }

      if (res.ok) {
        const data = await res.json();
        setToken(activeToken);
        setUserType(data.user_type);
        localStorage.setItem("fj_usertype", data.user_type);

        if (data.user_type === "recruiter") {
          try {
            const profileRes = await fetch(`${API}/accounts/recruiter/profile/`, {
              headers: { Authorization: `Bearer ${activeToken}` },
            });
            if (profileRes.ok) {
              const profile = await profileRes.json();
              if (profile.company_name) {
                localStorage.setItem("fj_company", profile.company_name);
                setCompanySet(profile.company_name);
              } else {
                localStorage.removeItem("fj_company");
                setCompanySet(null);
              }
            }
          } catch { /* ignore */ }

        } else if (data.user_type === "candidate") {
          try {
            const profileRes = await fetch(`${API}/accounts/dashboard/`, {
              headers: { Authorization: `Bearer ${activeToken}` },
            });
            if (profileRes.ok) {
              const profile = await profileRes.json();
              if (profile.profile?.first_name) {
                localStorage.setItem("fj_candidate_ready", "true");
                setCandidateReady("true");
              } else {
                localStorage.removeItem("fj_candidate_ready");
                setCandidateReady(null);
              }
            }
          } catch { /* ignore */ }
        }
      }

      setChecking(false);
    };

    verify();
  }, []);

  // ── Auto-refresh token every 50 mins ──────────────────────────
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      if (newToken) setToken(newToken);
      else handleLogout();
    }, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const handleAuth = (access, refresh, type, companyName = "") => {
    localStorage.setItem("fj_token",    access);
    localStorage.setItem("fj_refresh",  refresh);
    localStorage.setItem("fj_usertype", type);
    if (type === "recruiter" && companyName) {
      localStorage.setItem("fj_company", companyName);
      setCompanySet(companyName);
    }
    setToken(access);
    setUserType(type);
    // Clean up the URL
    window.history.replaceState({}, "", "/");
    setPage(type === "recruiter" ? "recruiter_dashboard" : "jobs");
  };

  const handleLogout = () => {
    ["fj_token","fj_refresh","fj_usertype","fj_company","fj_candidate_ready"].forEach(k => localStorage.removeItem(k));
    setToken(null); setUserType(null); setCompanySet(null); setCandidateReady(null);
    setPage("jobs");
  };

  const handleRecruiterOnboardingComplete = (companyName) => {
    localStorage.setItem("fj_company", companyName);
    setCompanySet(companyName);
    setPage("recruiter_dashboard");
  };

  const handleCandidateOnboardingComplete = ({ name }) => {
    localStorage.setItem("fj_candidate_ready", "true");
    if (name) localStorage.setItem("fj_candidate_name", name);
    setCandidateReady("true");
    setPage("jobs");
  };

  // ── Google OAuth callback — AFTER all handlers are defined ────
  if (window.location.pathname === "/auth/callback") {
    return <AuthCallback onAuth={handleAuth} />;
  }

  // Loading spinner
  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#f3f2f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e05c00", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!token) return <AuthScreen onAuth={handleAuth} />;

  if (userType === "recruiter" && !companySet) {
    return <RecruiterOnboarding token={token} onComplete={handleRecruiterOnboardingComplete} />;
  }

  if (userType === "candidate" && !candidateReady) {
    return (
      <CandidateOnboarding
        token={token}
        email={localStorage.getItem("fj_usertype") || ""}
        onComplete={handleCandidateOnboardingComplete}
      />
    );
  }

  const pages = {
    jobs:                 <JobsPage           token={token} userType={userType} />,
    recommended:          <RecommendedPage    token={token} />,
    applications:         <ApplicationsPage   token={token} />,
    dashboard:            <CandidateDashboard token={token} />,
    recruiter_dashboard:  <RecruiterDashboard token={token} />,
    my_jobs:              <MyJobsPage         token={token} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f2f1" }}>
      <style>{globalStyles}</style>
      <Topbar
        userType={userType}
        onLogout={handleLogout}
        page={page}
        setPage={setPage}
      />
      {pages[page] ?? pages["jobs"]}
    </div>
  );
}