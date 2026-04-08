# MangoZila Deployment (Render + Vercel)

This setup is recommended:
- Backend API: Render (Node web service)
- Frontend: Vercel (Vite static site)

Do not deploy this backend on Vercel without refactoring to serverless functions.

## 1) Prepare secrets before deployment

Generate/collect these values:
- MongoDB Atlas connection string
- JWT secret (strong random string, at least 32 chars)
- Cloudinary credentials (cloud name, api key, api secret)
- SMTP credentials (email + app password)
- Firebase Admin credentials (optional, only if using OTP)

## 2) Deploy backend to Render

### Option A: Blueprint (recommended)
1. Push this repository to GitHub.
2. In Render, click New + -> Blueprint.
3. Select this repo.
4. Render will detect render.yaml.
5. Fill all variables marked sync: false.
6. Deploy.

### Option B: Manual web service
- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
- Environment: Node

### Backend environment variables (Render)
Set these in Render service environment variables:

Required:
- NODE_ENV=production
- PORT=10000
- MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
- JWT_SECRET=<long-random-secret>
- FRONTEND_URL=https://<your-vercel-domain>
- API_URL=https://<your-render-domain>

Recommended for production uploads:
- CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
- CLOUDINARY_API_KEY=<your-cloudinary-api-key>
- CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

Recommended for email notifications:
- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_USER=<your-email@gmail.com>
- EMAIL_PASS=<gmail-app-password>
- EMAIL_FROM=MangoZila <your-email@gmail.com>

Optional (needed for Firebase phone OTP):
- FIREBASE_PROJECT_ID=<firebase-project-id>
- FIREBASE_CLIENT_EMAIL=<service-account-client-email>
- FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

After deploy, verify:
- https://<your-render-domain>/api/health

## 3) Deploy frontend to Vercel

1. In Vercel, click Add New -> Project.
2. Import this same GitHub repo.
3. Set Root Directory to frontend.
4. Framework Preset: Vite.
5. Build Command: npm run build (default).
6. Output Directory: dist (default).
7. Add environment variable below.
8. Deploy.

### Frontend environment variable (Vercel)
- VITE_API_URL=https://<your-render-domain>/api

Important:
- If backend URL changes, update VITE_API_URL and redeploy frontend.

## 4) Connect frontend and backend domains

After both are live:
1. Copy Vercel production URL.
2. Put it in backend FRONTEND_URL on Render.
3. Confirm backend API_URL equals Render URL.
4. Redeploy backend if needed.
5. Redeploy frontend if VITE_API_URL changed.

## 5) Post-deploy verification checklist

- Frontend loads successfully on Vercel URL.
- API health endpoint returns OK.
- Login/register works.
- Product/image upload works (Cloudinary configured).
- Checkout/order creation works.
- Order email is delivered (SMTP configured).
- CORS errors are not present in browser console.

## 6) Troubleshooting

- 404 on frontend route refresh:
  - Keep frontend/vercel.json rewrite rule (already added).

- CORS blocked:
  - FRONTEND_URL on Render must exactly match Vercel domain.

- Images not persisting:
  - Set Cloudinary keys in Render (local disk is ephemeral on hosted services).

- Firebase OTP not working:
  - Ensure all FIREBASE_* values are valid and private key keeps escaped \n.

- Mail not sending:
  - EMAIL_USER and EMAIL_PASS must be valid SMTP credentials.

## 7) Where deployment files are

- render.yaml
- backend/.env.example
- frontend/.env.example
- frontend/vercel.json
