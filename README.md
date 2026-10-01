# Parkly API — Parking Management REST API

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/) [![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

A professional **Parking Management REST API** built with **Node.js**, **Express.js**, and **MongoDB**.

Parkly helps users find nearby parking garages, while garage owners can manage their garages and parking availability.

---

## 🚀 Key Features

- **JWT Authentication** — Secure authentication with account activation and password reset
- **Role-Based Access Control** — Owner and Manager authorization
- **Garage Management** — Create, update, delete, and manage parking garages
- **Nearby Garage Search** — Location-based search using MongoDB geospatial queries
- **Parking Availability** — Manage available parking spaces
- **Reviews & Ratings** — Garage reviews with automatic average rating calculation
- **Email Service** — Account activation and password reset emails via SMTP
- **Rate Limiting** — Protection for sensitive and public endpoints
- **Input Validation** — Request validation before reaching controllers
- **Database Seeding** — Creates initial Owner, Manager, Garage, and Review data
- **Docker Support** — Run the API inside a container

---

## 🏗️ Project Structure

```text
Parkly/
├── src/
│   ├── controllers/   # Business logic
│   ├── middlewares/   # Authentication, authorization, validation, rate limiter
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   ├── services/      # Email and external services
│   ├── seed/          # Database seed
│   ├── utils/         # Utility functions
│   └── app.js         # Express application
│
├── Dockerfile
├── package.json
└── README.md
```

---

## 🚦 Getting Started

```bash
git clone https://github.com/ziad-ahmed-abdulrahman/parkly-api.git
cd Parkly
npm install
```

Configure your environment variables, then seed the database:

```bash
node src/seed/seed.js
```

Start the API:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

---

## 📡 Available Routes

| **Prefix**     | **Resource**                                    |
| -------------- | ----------------------------------------------- |
| `/api/auth`    | Registration, Login, Activation, Password Reset |
| `/api/users`   | Profile and Manager User Management             |
| `/api/garages` | Garage Management and Nearby Search             |
| `/api/reviews` | Garage Reviews and Ratings                      |

---

## 🐳 Docker

Build the image:

```bash
docker build -t parkly-api .
```

Run the container:

```bash
docker run -p 5000:5000 parkly-api
```

---

## 👤 Roles

| **Role**  | **Access**                                 |
| --------- | ------------------------------------------ |
| `owner`   | Manage own garages                         |
| `manager` | Manage users and all garages               |
| `guest`   | Search garages and view public information |

---

## 👨‍💻 Author

**Ziad Ahmed**
