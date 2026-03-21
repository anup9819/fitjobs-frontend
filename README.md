# TalentFlow – Frontend

React frontend for the TalentFlow Django job portal.

## File Structure

```
src/
├── App.jsx                        # Root router — just imports & wires pages
│
├── api/
│   └── index.js                   # All HTTP calls (get, post, patch, uploadFile)
│
├── styles/
│   └── global.js                  # CSS string injected via <style> — fonts, resets, animations
│
├── components/
│   └── index.jsx                  # Shared UI: Btn, Toast, StatusBadge, ScoreBar,
│                                  #            Spinner, Empty, Topbar, JobCard
│
└── pages/
    ├── AuthScreen.jsx             # Login / Register + Google OAuth button
    ├── JobsPage.jsx               # Browse & search jobs
    ├── RecommendedPage.jsx        # AI-matched recommended jobs
    ├── ApplicationsPage.jsx       # Candidate application tracker
    ├── CandidateDashboard.jsx     # Stats, top matches, resume upload
    ├── RecruiterDashboard.jsx     # Post jobs, view & rank candidates, update status
    └── MyJobsPage.jsx             # Recruiter's active listings
```

## Quick Start

```bash
# 1. Create React app
npm create vite@latest talentflow -- --template react
cd talentflow

# 2. Replace src/ with this folder's contents

# 3. Start dev server
npm run dev
```

Make sure your Django backend is running on `http://localhost:8000`.

## API Base URL

Edit `src/api/index.js` → change `API` constant for production:

```js
export const API = "https://your-backend.railway.app/api";
```

## Google OAuth

The Google button points to `${API}/accounts/google/login/`.
To enable it on the backend:

```bash
pip install django-allauth
```

Add to `settings.py`:
```python
INSTALLED_APPS += ["allauth", "allauth.account", "allauth.socialaccount", "allauth.socialaccount.providers.google"]
AUTHENTICATION_BACKENDS = ["allauth.account.auth_backends.AuthenticationBackend"]
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
    }
}
```

Then configure a Google OAuth 2.0 client in [Google Cloud Console](https://console.cloud.google.com/).
