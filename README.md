# AI Invoice Generator

A full-stack MERN application that leverages Google Gemini AI to extract structured invoice data from raw text, automate invoice creation, and provide business insights.

---

## Features

- **AI Invoice Parser** — Paste any raw text, and AI extracts client name, items, prices, and address automatically
- **AI Email Reminder** — Generate a professional payment reminder email for any invoice with one click
- **AI Dashboard Insights** — Get AI-powered business analytics based on your invoice data
- **Invoice Management** — Create, view, update status (Paid/Unpaid), and delete invoices
- **Search & Filter** — Search invoices by invoice number or client name, filter by status
- **Print / Download** — Print any invoice directly from the browser as a PDF
- **Profile & Prefill** — Save your business details and auto-fill the "Bill From" section when creating invoices
- **Authentication** — Secure login and signup with JWT-based auth and protected routes
- **Toast Notifications** — Real-time success/error feedback on all actions

---

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google Gemini AI** (`@google/genai`) for all AI features

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Axios** for API calls
- **React Router DOM** for routing
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Inter** (Google Fonts)

---

## Project Structure

```
ai-invoice-generator/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aicontroller.js
│   │   ├── authcontroller.js
│   │   └── invoicecontroller.js
│   ├── middlewares/
│   │   └── authmiddleware.js
│   ├── models/
│   │   ├── Invoice.js
│   │   └── User.js
│   ├── routes/
│   │   ├── airoutes.js
│   │   ├── authroutes.js
│   │   └── invoiceroutes.js
│   └── server.js
│
└── frontend/invoice-generator/
    └── src/
        ├── components/
        │   ├── auth/
        │   │   └── ProtectedRoutes.jsx
        │   └── layouts/
        │       ├── DashboardLayout.jsx
        │       ├── Navbar.jsx
        │       └── Sidebar.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── AI/AIParser.jsx
        │   ├── Auth/Login.jsx
        │   ├── Auth/SignUp.jsx
        │   ├── Dashboard/Dashboard.jsx
        │   ├── Invoices/AllInvoices.jsx
        │   ├── Invoices/CreateInvoice.jsx
        │   ├── Invoices/InvoiceDetail.jsx
        │   ├── LandingPage/LandingPage.jsx
        │   └── Profile/ProfilePage.jsx
        └── utils/
            ├── apiPaths.js
            ├── axiosInstance.js
            └── helper.js
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Mridul012/ai-invoice-generator.git
cd ai-invoice-generator
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8000
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd frontend/invoice-generator
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/me` | Update user profile |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/invoices` | Create a new invoice |
| GET | `/api/invoices` | Get all invoices for user |
| GET | `/api/invoices/:id` | Get invoice by ID |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/parse-text` | Parse raw text into invoice data |
| POST | `/api/ai/generate-remainder` | Generate payment reminder email |
| POST | `/api/ai/dashboard-summary` | Get AI business insights |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Backend server port (default: 8000) |
| `GEMINI_API_KEY` | Google Gemini API key |

>  Never commit your `.env` file. It is already listed in `.gitignore`.

---


## Author

**Mridul** — [@Mridul012](https://github.com/Mridul012)

---


