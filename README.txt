Scalable Web App - Auth + Dashboard

Backend:
  cd backend
  npm install
  # set your MongoDB URI in .env
  npm run dev

Frontend:
  cd frontend
  npm install
  npm run dev

Make sure backend is on http://localhost:5000
Optionally create frontend/.env with:
  VITE_API_URL=http://localhost:5000
