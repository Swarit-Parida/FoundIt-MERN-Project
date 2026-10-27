# FoundIt — Campus Lost & Found

FoundIt is a full-stack MERN application for campus communities to report lost or found belongings, discover listings, submit ownership claims, and track the handover workflow. It is designed around a practical community problem rather than a static listing page.

> **Project status:** Source code and local setup are included. You must configure MongoDB and environment variables, run the app, test it, create your own GitHub repository, and deploy it to produce real submission links. No deployment is claimed by this repository until you complete those steps.

## Problem statement

When students lose belongings around campus, information is scattered across group chats, notice boards, and word of mouth. People who find items may not know how to locate the owner, and owners may not know where to look. FoundIt provides a central, searchable board and a structured claim/review/return workflow.

## Target users

- Students reporting something they lost.
- Students or staff reporting an item they found.
- Listing owners reviewing claim requests and confirming a safe return.

## Solution and key workflows

1. **Create an account / log in:** email validation, password hashing with bcrypt, signed JWT, protected API routes.
2. **Report an item:** create a LOST or FOUND listing with category, description, location, date and optional public image URL.
3. **Discover listings:** search title, description and location; filter by type and category; sort by newest or oldest.
4. **Submit and review claims:** a logged-in non-owner can submit a claim on a FOUND listing. The owner can approve or reject pending claims. Approving one claim rejects other pending claims and locks the listing from further claims.
5. **Close the loop:** the owner marks an item returned after an approved claim. Owners can view their listings and delete their own listings.

## Tech stack

- **Frontend:** React 18, Vite, React Router, Axios, Lucide React, custom responsive CSS.
- **Backend:** Node.js, Express, REST API.
- **Database:** MongoDB with Mongoose schemas and indexes.
- **Security:** bcrypt password hashing, JWT authentication, Helmet security headers, CORS allowlist, auth rate limiting, request body size limit, server-side validation, resource ownership checks.

## Architecture

```text
Browser (React + Vite)
  ├── AuthContext: session state and token handling
  ├── Pages: Discover, Register/Login, Report Item, Item Details, My Listings
  └── Axios requests with Bearer token when signed in
             │ HTTP / JSON
             ▼
Express REST API (/api)
  ├── /api/auth  — register, login, current user
  ├── /api/items — search, details, create, claims, status, owner listings
  ├── Auth middleware — verifies JWT and loads user
  ├── Validation / ownership checks / centralized errors
  └── Mongoose models
             │
             ▼
MongoDB
  ├── users: name, unique email, password hash
  └── items: item details, owner, status, embedded claim history
```

### Important design decisions

- Claims are embedded in an item because each claim belongs to one listing and is usually displayed with that listing. A claim stores the claimant, message, status and creation time.
- The server, not just the frontend, checks who owns a listing before allowing deletion, claim review or status changes.
- Claim states are `PENDING`, `APPROVED`, and `REJECTED`; listing states are `OPEN`, `CLAIMED`, and `RETURNED`. Only one claim can be approved while a listing is open.
- Public listings exclude returned items from the main discovery feed, while an owner can still see them under My Listings.
- The optional image is a publicly accessible HTTP(S) URL, not a direct file upload. File uploads are deliberately out of scope for this deadline-sized version.

## Project structure

```text
foundit-project/
├── client/
│   ├── src/components/       # Layout, item cards, protected route
│   ├── src/context/          # Auth context
│   ├── src/pages/            # Home, Auth, Report, Details, My Listings
│   ├── src/api.js
│   ├── src/styles.css
│   └── .env.example
├── server/
│   ├── src/config/           # MongoDB connection
│   ├── src/controllers/      # Auth and listing workflows
│   ├── src/middleware/       # JWT and error handling
│   ├── src/models/           # User and Item schemas
│   ├── src/routes/           # REST endpoints
│   ├── src/server.js
│   └── .env.example
├── docs/API.md
├── docs/DEMO_SCRIPT.md
└── package.json
```

## Local setup

### Prerequisites

- Node.js 20 or later recommended.
- npm.
- A MongoDB database: local MongoDB or a MongoDB Atlas cluster.

### 1. Configure the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and fill in values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/foundit
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
CLIENT_URL=http://localhost:5173
```

Use a random secret of at least 32 characters. Never commit `.env` files or real credentials. For MongoDB Atlas, use your database connection string and make sure the network access rules allow the environment you are running from.

### 2. Configure the frontend

```bash
cd ../client
npm install
```

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the application

Open two terminals from the repository root:

Terminal A:

```bash
npm install
npm run dev --prefix server
```

Terminal B:

```bash
npm run dev --prefix client
```

Open `http://localhost:5173`. The API health check is at `http://localhost:5000/api/health`.

Alternatively, after installing the root `concurrently` dependency and both subprojects, use `npm run dev` from the root.

### 4. Production build

```bash
npm run build --prefix client
npm start --prefix server
```

Set `NODE_ENV=production`, `MONGO_URI`, a secure `JWT_SECRET`, `CLIENT_URL` to your deployed frontend origin, and `VITE_API_URL` to the deployed API base ending in `/api`. Because Vite embeds `VITE_API_URL` at build time, set it before building/redeploying the frontend.

## Environment variables

| Variable | Location | Purpose |
|---|---|---|
| `PORT` | server | API port (defaults to 5000) |
| `NODE_ENV` | server | Error response/logging mode |
| `MONGO_URI` | server | MongoDB connection string |
| `JWT_SECRET` | server | Signs and verifies login tokens; use a long random value |
| `CLIENT_URL` | server | Allowed frontend origin(s), comma-separated if needed |
| `VITE_API_URL` | client | API base URL compiled into the frontend |

## API overview

See [docs/API.md](docs/API.md) for request bodies and route details.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/items` | No | Search and filter open listings |
| GET | `/api/items/:id` | No | Listing details and claim status |
| POST | `/api/items` | Yes | Create a listing |
| GET | `/api/items/mine` | Yes | Current user's listings |
| POST | `/api/items/:id/claims` | Yes | Submit a claim on a found listing |
| PATCH | `/api/items/:id/claims/:claimId` | Yes | Approve/reject a pending claim (owner only) |
| PATCH | `/api/items/:id/status` | Yes | Mark a listing returned (owner only) |
| DELETE | `/api/items/:id` | Yes | Delete own listing |

## Testing checklist

Use two separate accounts (Account A and Account B) to test ownership and claims.

- [ ] Register an account with a valid email and password of at least 8 characters.
- [ ] Try registering the same email again; expect a helpful conflict response.
- [ ] Log in with a wrong password; expect an error without exposing account details.
- [ ] Create a FOUND listing with all required fields.
- [ ] Search for it by title/location and filter by FOUND/category.
- [ ] Log in as a second user and submit a claim with a message of at least 10 characters.
- [ ] Confirm a duplicate claim is blocked.
- [ ] Log in as the listing owner and approve the claim; verify other pending claims are rejected.
- [ ] Mark the item returned; verify it disappears from the public feed but remains in My Listings.
- [ ] Verify a different user cannot delete or change the status of someone else's listing.
- [ ] Try invalid listing IDs and incomplete form data; confirm readable error messages.
- [ ] Refresh a signed-in page; confirm the session restores, or an expired/invalid token returns to login.

## Security and limitations

- Passwords are hashed; raw passwords are never returned by the API.
- JWT tokens are stored in browser localStorage in this implementation. This is practical for a classroom demo but increases exposure if the page suffers an XSS vulnerability; a production deployment could move to secure, HttpOnly, SameSite cookies with CSRF protections.
- Use a long, private JWT secret and never expose MongoDB credentials.
- Listing images are URLs only; validate that images are safe and use a managed upload service if direct uploads are added later.
- FoundIt does not independently verify item ownership or identity. Claim text is user-generated and handovers should happen in public campus locations.
- Email notifications, administrator moderation, direct uploads and real-time messaging are not implemented in this version and should not be presented as completed features.

## Deployment plan

A simple deployment is a static frontend host (for example, Vercel or Netlify), an API host (for example, Render), and MongoDB Atlas. Exact provider setup changes over time, so use the providers' current instructions. Configure frontend and backend environment variables separately, allow the deployed frontend origin in `CLIENT_URL`, and set `VITE_API_URL` to the deployed API URL ending in `/api` before building. Verify `/api/health`, register/login, create a listing, claim review, and status changes from the public deployment.

## Demo video

Aim for 3–5 minutes. Follow [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md). Show the product working in a browser; do not spend the video reading source code.

## AI usage disclosure

AI assistance was used to help brainstorm the product, scaffold parts of the implementation, and prepare documentation. The student should review, run, test, understand, and modify the code and should disclose assistance according to course requirements. Do not claim that a test or deployment succeeded unless you personally verified it.

## Final submission checklist

- [ ] Configure secrets and database connection locally and on deployment.
- [ ] Run the test checklist and fix any failures.
- [ ] Create a GitHub repository and push the source with meaningful commits as you make real changes.
- [ ] Verify the deployed frontend and API work in a private/incognito window.
- [ ] Record and upload the demo video, then test its share permissions.
- [ ] Replace placeholder links in your final submission details with the real repository, deployment and video links.
- [ ] Submit the official form before the deadline: https://forms.gle/sBy4sfqyiRG2Zpom9
