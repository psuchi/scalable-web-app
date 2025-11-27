Scalable Web App – Auth + Dashboard

This project is a full-stack web application built as an assignment to demonstrate:

- JWT-based authentication (register / login / logout)
- Protected routes on the frontend
- A user dashboard with CRUD operations on a sample entity (`tasks`)
- Basic backend API with validation & error handling
- Code structured so it can be scaled to production later

---

Tech Stack

Frontend

- React (Vite)
- React Router
- Axios
- Simple responsive CSS (can be swapped to Tailwind)

Backend

- Node.js
- Express
- JWT
- bcrypt for password hashing  
- (Currently using in-memory storage for users & tasks – easy to swap to MongoDB / Postgres)

---

Features

Authentication

- User registration with:
  - Name, email, password (validated, min length)
- User login with JWT token
- JWT stored on client and attached to all protected API requests
- Logout clears token and session
Dashboard

- Accessible only after login (protected route)
- Shows logged-in user’s name
- CRUD on **Tasks**:
  - Create task (title, description, status)
  - List tasks
  - Update task status
  - Delete task
- Search & filter:
  - Search by title (client → server query)
  - Filter by status (`pending`, `in-progress`, `done`)

Profile

- View logged-in user’s profile (name + email)
- Update name
- Logout from profile page


```bash
scalable-app/
  backend/        # Node/Express API (auth + tasks)
  frontend/       # React + Vite app (UI + routing)

