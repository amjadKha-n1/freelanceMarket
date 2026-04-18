# 💼 Freelance Marketplace Platform

A full-stack freelance marketplace web application where clients can hire freelancers, and freelancers can offer services, manage orders, and communicate seamlessly.

🌐 **Live Website:**
👉 https://freelance-marketplace-lvyx.onrender.com/

---

## 🚀 Features

### 👤 Authentication & Authorization

* User registration & login (JWT-based)
* Role-based access (Client, Freelancer, Admin)
* Protected routes

### 🧑‍💻 Freelancer Features

* Create and manage services
* Edit and delete services
* View orders and earnings

### 🛒 Client Features

* Browse services
* Search and filter services
* Place orders
* Leave reviews

### 💬 Messaging System

* Real-time-like messaging between users
* Conversation-based communication

### ⭐ Reviews & Ratings

* Clients can review freelancers
* Rating system for services

### 💳 Payments Integration

* Secure order handling
* Payment flow (Stripe-ready / integrated if applicable)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Context API
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Deployment

* Frontend: Render
* Backend: Render
* Database: MongoDB Atlas

---

## ⚙️ Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```
VITE_API_URL=https://freelance-marketplace-api.onrender.com/api
```

---

## 🧪 Running Locally

### 1. Clone the repository

```
https://github.com/amjadKha-n1/freelanceMarket.git
```

### 2. Setup Backend

```
cd server
npm install
npm start
```

### 3. Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🔐 API Endpoints (Sample)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Services

* `GET /api/services`
* `POST /api/services`
* `PUT /api/services/:id`
* `DELETE /api/services/:id`

---

## 🧠 Key Learnings

* Building a full MERN stack application
* Implementing JWT authentication securely
* Handling CORS and deployment issues
* Designing scalable backend architecture
* Managing global state with Context API

---

## 📌 Future Improvements

* Real-time messaging with WebSockets
* Advanced search & filtering
* Payment system enhancements
* Notifications system
* UI/UX improvements

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 👨‍💻 Author

**Amjad Khan**
📧 [amjad22558@gmail.com](mailto:amjad22558@gmail.com)
🔗 GitHub: https://github.com/amjadKha-n1
