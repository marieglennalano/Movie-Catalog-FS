
# 🎬 Movie Catalog - Full Stack MERN App

This is a Full Stack Movie Catalog web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows users to browse, view, and comment on movies, while admin users have access to manage the movie database via a dashboard.

## 🌐 Live Demo
[https://movie-catalog-fs.onrender.com](https://movie-catalog-fs.onrender.com)

> ⚠️ If deploying to Render, please allow a few seconds for the backend server to wake up.

---

## 🚀 Features

### 👤 Authentication
- User registration and login (JWT-based)
- Role-based access control (user vs admin)

### 🎞️ Movies
- View all movies as cards
- Search and filter movies
- View detailed movie information
- Leave comments on movies

### 🛠️ Admin Features
- Admin Dashboard at `/admin-dashboard`
- Add new movies
- Edit and update movie details
- Delete movies
- Protected routes with admin-only access

### 📱 Responsive UI
- Clean and responsive design using **React Bootstrap**
- SweetAlert2 for toast feedback and modals

---

## 📁 Project Structure

```
Movie-Catalog-FS/
├── client/         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── server/         # Express + MongoDB Backend
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── routes/
│   └── server.js
└── README.md
```

---

## 🔐 Admin Access

Use the following credentials to log in as an admin:

```
📧 Email: admin@example.com
🔑 Password: admin123
```

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router
- React Bootstrap
- SweetAlert2

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## 🧪 How to Run Locally

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

Marie Glenn Alano  
📍 Cavite, Philippines  
📧 marieglennalano@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/marie-glenn-alano-4aab99118/)  
🔗 [GitHub](https://github.com/marieglennalano)
