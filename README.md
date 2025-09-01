#  Notes App

A modern **Notes Application** built with **FastAPI (backend)** and **React (frontend)**.  
The app is tailored for **EdTech firms** with features like JWT authentication, CRUD operations for notes, a sleek UI/UX, and Docker support for easy deployment.

---

##  Features

- **Authentication**
  - Register and Login using JWT-based auth.
  - Secure session handling with token expiry.

- **Notes Management**
  - Create, Update, Delete, and List notes.
  - Floating **Add Note** button for quick note creation.
  - Character count limit (Title: 100, Content: 1000).

- **UI/UX**
  - Modern responsive design using **Tailwind CSS**.
  - Animations on hover, fade-in effects for note cards.
  - Mobile-friendly layout with top-right Logout button.
  - Floating action button for adding new notes.

- **Search & Filter**
  - Search through existing notes quickly.

- **SEO Enhancements**
  - Proper meta tags (title, description, OG tags, keywords).

- **Deployment**
  - Works both on **local system** and via **Docker Compose**.

---

##  Tech Stack

### Backend (FastAPI)
- FastAPI
- SQLAlchemy + MySQL
- JWT Authentication
- Uvicorn

### Frontend (React + Vite)
- React (Hooks, Context API)
- Tailwind CSS
- Axios

### Deployment
- Docker & Docker Compose

---

##  Installation Guide

### Prerequisites
Ensure you have installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/downloads/) (3.10+)
- [MySQL](https://dev.mysql.com/downloads/)
- [Docker](https://www.docker.com/get-started) & Docker Compose

---

##  Environment Variables

Create a `.env` file in the **backend** folder with:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=notes_user
DB_PASSWORD=notes_pass
DB_NAME=notes_app
SECRET_KEY=your_jwt_secret_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

##  Running Locally

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will start at: `http://127.0.0.1:8000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will start at: `http://127.0.0.1:5173`

---

##  Running with Docker

### 1. Build & Start
```bash
docker-compose up --build
```

### 2. Stopping Containers
```bash
docker-compose down
```

---

##  API Endpoints

### Authentication
- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login user

### Notes
- `GET /api/notes/` → List notes  
- `POST /api/notes/` → Create note  
- `PUT /api/notes/{id}` → Update note  
- `DELETE /api/notes/{id}` → Delete note  

---

##  UI Preview

### Login Page
- Clean form with email + password.
- Redirects to dashboard after login.

### Notes Dashboard
- Notes displayed in responsive cards.
- Hover animations & fade-in effects.
- Floating **+ Add Note** button at bottom-right.

### Create/Edit Note
- Title (max 100 chars)  
- Content (max 1000 chars, live character count)  
- Save/Update button with loading state.

### Logout
- Logout button available at **top-right corner**.

---

##  Project Structure

```
notes-app/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes/
│   │   └── auth/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

##  Future Improvements
- Rich text editor for notes.
- Tags & categories for better note organization.
- Sharing notes with others in the same org (EdTech use case).

---