# 🩸 BloodCare Portal

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

A full-stack MERN blood bank management system with **4 role-based dashboards** — Donor, Organisation, Hospital, and Admin.

---

## ✨ Features

- 🔐 **JWT Authentication** with role-based access control
- 👥 **4 Roles** — Donor, Organisation, Hospital, Admin
- 🩸 **Blood Inventory Management** — track donations in & issues out
- 📊 **Real-time stock availability** per blood group with visual indicators
- 🔍 **Search & Pagination** on all data tables
- 📱 **Responsive UI** built with Tailwind CSS
- 🛡️ **Admin Panel** — manage all users, view system-wide stats
- ⚡ **Formik + Yup** form validation throughout
- 🗄️ **Redux Toolkit** for global state management

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| State Management | Redux Toolkit |
| Forms | Formik + Yup |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| HTTP Client | Axios |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/Srushti-Mudholkar/BloodCarePortal.git
cd BloodCarePortal/BloodCare
```

**2. Install backend dependencies**
```bash
npm install
```

**3. Install frontend dependencies**
```bash
cd client && npm install
```

**4. Create `.env` file in `BloodCare/`**
```env
PORT=8080
DEV_MODE=development
MONGO_URL=mongodb://127.0.0.1:27017/bloodcare
JWT_SECRET=your_secret_key_here
```

**5. Run the app**

Terminal 1 — Backend:
```bash
npm run server
```

Terminal 2 — Frontend:
```bash
cd client && npm run dev
```

Open → **http://localhost:5173**

---

## 📁 Project Structure

```
BloodCare/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, Current User
│   ├── inventoryController.js # Blood in/out, availability
│   └── adminController.js     # Admin CRUD operations
├── middlewares/
│   └── authMiddleware.js      # JWT + role verification
├── models/
│   ├── userModel.js           # User schema (all 4 roles)
│   └── inventoryModel.js      # Blood inventory schema
├── routes/
│   ├── authRoutes.js
│   ├── inventoryRoutes.js
│   └── adminRoutes.js
├── validators/
│   └── authValidator.js       # Zod schemas
├── server.js
└── client/                    # React frontend
    └── src/
        ├── components/
        │   ├── Layout.jsx     # Sidebar + header
        │   ├── DataTable.jsx  # Reusable table with search & pagination
        │   └── StatCard.jsx   # Dashboard stat cards
        ├── pages/
        │   ├── auth/          # Login, Register
        │   ├── donor/         # Donor dashboard & history
        │   ├── organisation/  # Org dashboard, inventory, donors, hospitals
        │   ├── hospital/      # Hospital dashboard & history
        │   └── admin/         # Admin dashboard & user management
        ├── redux/
        │   ├── store.js
        │   └── authSlice.js
        └── utils/
            └── axios.js       # Axios instance with JWT interceptor
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/current-user` | Get logged-in user |

### Inventory
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/inventory/create` | Add blood record |
| GET | `/api/v1/inventory/get` | Get org inventory |
| GET | `/api/v1/inventory/availability` | Blood group availability |
| GET | `/api/v1/inventory/donor-history` | Donor's donation history |
| GET | `/api/v1/inventory/hospital-history` | Hospital's request history |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/admin/donors` | All donors |
| GET | `/api/v1/admin/hospitals` | All hospitals |
| GET | `/api/v1/admin/organisations` | All organisations |
| GET | `/api/v1/admin/stats` | System stats |
| DELETE | `/api/v1/admin/delete-user/:id` | Delete user |

---

## 👤 Author

**Srushti Mudholkar**
- GitHub: [@Srushti-Mudholkar](https://github.com/Srushti-Mudholkar)

---

## 📄 License

MIT License
