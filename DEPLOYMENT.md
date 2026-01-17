# Deployment Guide for MyPortfolio

## Can I host on Vercel?

**Yes and No.**

1.  **Frontend (React)**: ✅ **YES**. Vercel is perfect for this.
2.  **Backend (Node.js)**: ⚠️ **YES, BUT...** Vercel runs "Serverless Functions". This means:
    - The server "sleeps" when not used.
    - **CRITICAL**: You **CANNOT** save images to a local `uploads/` folder on Vercel. They will disappear immediately.
    - _Solution_: You must change your code to upload images to a service like **Cloudinary** (Free).
3.  **Database (MySQL)**: ❌ **NO**. Vercel does not host generic MySQL databases.
    - _Solution_: You need a separate database host. **Aiven** or **Railway** (free tiers available) are popular choices.

---

## Recommended Free/Cheap Stack

To get this running for free or very cheap, I recommend this architecture:

1.  **Database**: **Aiven** (Free MySQL) or **Railway**.
2.  **Image Storage**: **Cloudinary** (Free tier is generous).
3.  **Backend**: **Render** or **Railway** (Easier than Vercel for Node apps).
4.  **Frontend**: **Vercel** (Best performance).

---

## Step-by-Step Migration Plan

### Phase 1: Database (The Foundation)

1.  Sign up for **Aiven.io** (Free MySQL) or **Railway.app**.
2.  Create a MySQL Service.
3.  Copy the **Connection URL** (looks like `mysql://user:password@host:port/dbname`).
4.  Use a tool like **HeidiSQL** or **DBeaver** on your PC to connect to this remote database.
5.  Run your `schema.sql` file there to create the tables.

### Phase 2: Images (The Tricky Part)

Since we can't save files to the disk on the cloud:

1.  Sign up for **Cloudinary** (Free).
2.  Get your `Check Cloud name`, `API Key`, and `API Secret`.
3.  **Code Change Required**: I need to update your backend to send files to Cloudinary instead of `fs.writeFile`.

### Phase 3: Backend Deployment (Render or Railway)

1.  Push your code to **GitHub**.
2.  Sign up for **Render.com**.
3.  Create a **Web Service**.
4.  Connect your GitHub repo.
5.  Set Root Directory: `server`
6.  Build Command: `npm install`
7.  Start Command: `node index.js`
8.  Add Environment Variables:
    - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (from Phase 1)
    - `CLOUDINARY_URL` (from Phase 2)

### Phase 4: Frontend Deployment (Vercel)

1.  Go to **Vercel.com**.
2.  "Add New Project" -> Import from GitHub.
3.  Framework: **Vite**.
4.  Root Directory: `.` (Current).
5.  **Environment Variable**:
    - You need to change your `axios` calls in the React code to point to your **Render Backend URL** instead of `localhost:5000`.
    - Create a `.env.production` file in React:
      `VITE_API_URL=https://your-backend-app.onrender.com`
    - Update `axios.get('http://localhost:5000/...')` to `axios.get(import.meta.env.VITE_API_URL + '/...')`.

---

## Do you want me to help with Phase 2 (Cloudinary)?

Changing the image upload system to Cloudinary is the most critical step to making this "cloud-ready".
Without it, any hosting platform (Vercel, Render, Heroku) will delete your uploaded images every time the server restarts (daily).
