# Cookie-Licking Detector

A smart tool to tackle the “reserved issue” problem in open-source projects by detecting stale issue claims, sending polite nudges, and auto-releasing inactive assignments to improve community collaboration and maintainers' workflow.

---

## 🏆 Team Syntax Syndicate

| Role         | Name      |
|--------------|-----------|
| Team Leader  | Amaan     |
| Team Member  | Abhimanyu |
| Team Member  | Hiranya   |
| Team Member  | Kushagra  |
| Team Member  | Utkarsh   |

---

## 🚀 Project Overview

In open source, many issues are “claimed” by contributors but sometimes never completed — a behavior called **cookie-licking**. This leads to frustration for newcomers and maintainers alike, blocking progress on issues unnecessarily.

Our Cookie-Licking Detector:

- Detects issues that are claimed but show no linked pull requests or commits after a configurable period.
- Sends polite, contextual nudges to remind contributors about their stale claims.
- Auto-releases issues after a grace period, making them available for others.
- Provides a clean dashboard to visualize active, dormant, and released issue claims.

---

## 🛠️ Features

- Fetches issue data from GitHub using the GitHub API.
- Simple rule-based detection algorithm to identify stale claims.
- Dashboard UI showing active, stale, and released issues with nudge and release options.
- Sends polite nudge comments to contributors about inactivity.
- Configurable grace periods before auto-release.
- Clean deployment-ready React + Node.js/FastAPI stack.

---

## 📦 Tech Stack

- **Frontend:** React, Tailwind CSS, Axios for API calls  
- **Backend:** Node.js, Express.js  
- **APIs:** GitHub REST API with Personal Access Token (PAT)  
- **Database:** MongoDB (optional, for persistence)  
- **Deployment:** Vercel (frontend), Render/Heroku (backend)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v16+  
- GitHub Personal Access Token (PAT)  
- MongoDB (optional)

### Installation

1. Clone the repository  
```bash
git clone https://github.com/yourorg/cookie-licking-detector.git
cd cookie-licking-detector
