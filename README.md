# FoundIt — Campus Lost & Found

A campus community platform that helps people reconnect with their lost belongings. FoundIt allows students to report lost or found items, browse listings, and submit claims to help return belongings to their rightful owners.

## 🌐 Live Demo

- **Frontend:** https://foundit-campus-swarit-2026.netlify.app
- **Backend API:** https://foundit-api-6wf0.onrender.com

## ✨ Features

- **User Authentication:** Register and log in to your account.
- **Browse Listings:** Explore lost and found items reported by the campus community.
- **Search and Filters:** Search listings and filter by category or item type.
- **Report Items:** Create listings with item details, descriptions, locations, and images.
- **Claim Items:** Submit claims for items you believe belong to you.
- **Claim Management:** Item owners can review claims and approve or reject them.
- **Mark Items as Returned:** Update an item's status after it has been successfully returned.
- **My Listings:** View and manage your own reported items.
- **Responsive Interface:** Access the application across different screen sizes.
- **Persistent Storage:** Store user accounts and item listings in MongoDB.

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- CSS
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT-based authentication
- bcrypt password hashing

**Deployment**
- Netlify — frontend hosting
- Render — backend hosting
- MongoDB Atlas — database hosting
- GitHub — version control

## 📁 Project Structure

```text
FoundIt-MERN-Project/
├── client/
│   ├── public/
│   │   └── _redirects
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── docs/
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Install the following before running the application locally:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Swarit-Parida/FoundIt-MERN-Project.git
cd FoundIt-MERN-Project
```

### 2. Install dependencies

From the project root:

```bash
npm install
```

Install the frontend and backend dependencies if they are not installed automatically by the root scripts:

```bash
cd client
npm install
cd ../server
npm install
cd ..
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Replace the example database connection string and secret with your own values. Never commit real credentials or secret keys to GitHub.

### 4. Run the application

From the root directory, run:

```bash
npm run dev
```

If your root scripts do not start both applications, open two terminals.

**Terminal 1 — Backend**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

Open the local frontend URL displayed by Vite, usually:

http://localhost:5173

## ⚙️ Deployment

### Frontend — Netlify

The React frontend is deployed on Netlify.

Configure the following build settings for this repository:

| Setting | Value |
|---|---|
| Base directory | `client` |
| Build command | `npm run build` |
| Publish directory | `dist` |

Set the following environment variable in Netlify:

```env
VITE_API_URL=https://foundit-api-6wf0.onrender.com/api
```

The `client/public/_redirects` file should contain:

```text
/*    /index.html   200
```

This enables React Router routes to work when users refresh a page or open a route directly.

### Backend — Render

The Express API is deployed on Render as a Node.js web service.

Configure:

| Setting | Value |
|---|---|
| Root directory | `server` |
| Build command | `npm install` |
| Start command | `npm start` |

Add the following environment variables in Render:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — your authentication secret
- `CLIENT_URL` — your deployed Netlify frontend URL
- `NODE_ENV` — `production`

The backend must listen on the port provided by the hosting platform when deployed.

### Database — MongoDB Atlas

MongoDB Atlas stores application data, including user accounts and item listings. Configure the database connection string as an environment variable on the backend hosting platform.

## 🔐 Security

- Environment files containing credentials are excluded from version control.
- Passwords are hashed before storage.
- Authentication uses JSON Web Tokens.
- Protected operations require appropriate authentication.
- Production environment variables are configured through the hosting provider.

Never publish database credentials, JWT secrets, or other private keys in the repository.

## 🧪 Testing the Application

You can verify the main application workflows by:

1. Creating a user account and logging in.
2. Reporting a lost or found item.
3. Browsing and searching item listings.
4. Opening an item's details page.
5. Submitting a claim for an item.
6. Logging in as the item's owner and reviewing the claim.
7. Approving or rejecting the claim.
8. Marking an item as returned, where applicable.
9. Refreshing pages and checking that navigation works correctly.

## 🎯 Project Objective

FoundIt aims to make campus lost-and-found processes simpler and more organized by providing a shared platform for reporting items, managing claims, and coordinating the return of lost belongings.

## 👨‍💻 Author

**Swarit Parida**

GitHub: [Swarit-Parida](https://github.com/Swarit-Parida)

---

*Built as a MERN stack full-stack project.*
