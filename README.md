# 💳 Credit Card Debt Tracker

A full-stack web application to help you track and manage your credit card debts efficiently. Built with **React**, **Node.js/Express**, **PostgreSQL**, and **Prisma ORM**.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure password hashing (bcrypt)
- **Protected routes** - All financial data requires authentication
- **Rate limiting** - Prevents brute force attacks (100 req/15min)
- **Security headers** - Helmet.js for HTTP security
- **CORS protection** - Configurable origin restrictions

### 💰 Financial Management
- **Multiple credit cards** - Track unlimited cards in one place
- **Real-time balance tracking** - Automatically updates with transactions
- **Payment tracking** - Record payments and purchases
- **Due date reminders** - Visual dashboard of upcoming payments
- **Interest rate monitoring** - Track APR for each card
- **Minimum payment calculator** - Never miss minimum payment amounts

### 📊 Dashboard & Analytics
- **Interactive charts** - Visualize your debt using Chart.js
- **Total debt overview** - See all debts at a glance
- **Payment obligations** - Summary of all minimum payments
- **Card details** - Detailed view of each card

### 🎨 User Experience
- **Responsive design** - Works on desktop, tablet, and mobile
- **Modern UI** - Built with Tailwind CSS
- **Fast loading** - React Query for optimized data fetching
- **Error handling** - User-friendly error messages
- **Loading states** - Clear feedback during operations

---

## 🛠️ Tech Stack

### Frontend
- **React 19.0** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Router 7.4** - Client-side routing
- **TanStack React Query 5.7** - Server state management
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **HeadlessUI & HeroIcons** - Accessible UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1** - Web framework
- **JavaScript (ES6+)** - Modern JavaScript
- **Prisma 6.5** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **express-rate-limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart development server
- **Prisma Studio** - Database GUI

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Overview of all credit cards, total debt, and upcoming payments*

### Card Management
![Cards](./screenshots/cards.png)
*Manage multiple credit cards with detailed information*

### Authentication
![Login](./screenshots/login.png)
*Secure login and registration system*

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional) - [Download](https://git-scm.com/)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Credit_card.git
cd Credit_card
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔧 Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/credit_card_db?schema=public"

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Important**:
- Replace `username` and `password` with your PostgreSQL credentials
- Change `JWT_SECRET` to a random string in production
- Never commit the `.env` file to version control

> 💡 **Tip**: Use `.env.example` as a template (already provided in the project)

---

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

**Using pgAdmin:**
1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Database name: `credit_card_db`
4. Click "Save"

**Using psql:**
```bash
psql -U postgres
CREATE DATABASE credit_card_db;
\q
```

### 2. Run Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### Database Schema

The application uses three main tables:

**Users**
- `id` (UUID, Primary Key)
- `email` (Unique)
- `name`
- `password` (Hashed with bcrypt)
- `createdAt`, `updatedAt`

**CreditCards**
- `id` (UUID, Primary Key)
- `name` (Card name)
- `balance` (Current debt)
- `interestRate` (APR percentage)
- `dueDate` (Payment due date)
- `minimumPayment`
- `userId` (Foreign Key → Users)
- `createdAt`, `updatedAt`

**Transactions**
- `id` (UUID, Primary Key)
- `amount`
- `type` ("payment" or "purchase")
- `date`
- `description` (Optional)
- `cardId` (Foreign Key → CreditCards)
- `createdAt`, `updatedAt`

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Credit Card Endpoints

All endpoints require `Authorization: Bearer <token>` header.

#### Get All Cards
```http
GET /api/cards
```

#### Create Card
```http
POST /api/cards
Content-Type: application/json

{
  "name": "Visa Platinum",
  "balance": 5000,
  "interestRate": 18.5,
  "dueDate": "2024-02-15",
  "minimumPayment": 150
}
```

#### Get Card by ID
```http
GET /api/cards/:id
```

#### Update Card
```http
PUT /api/cards/:id
Content-Type: application/json

{
  "balance": 4500,
  "minimumPayment": 135
}
```

#### Delete Card
```http
DELETE /api/cards/:id
```

### Transaction Endpoints

#### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
  "amount": 500,
  "type": "payment",
  "date": "2024-01-15",
  "description": "January payment",
  "cardId": "card-uuid"
}
```

#### Get Card Transactions
```http
GET /api/transactions/card/:cardId
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
```

For complete API documentation, see [backend/README.md](./backend/README.md)

---

## 📁 Project Structure

```
Credit_card/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── index.js           # Express server entry point
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js        # JWT authentication
│   │   │   └── errorHandler.js
│   │   └── routes/            # API routes
│   │       ├── auth.js        # Authentication routes
│   │       ├── users.js       # User management
│   │       ├── cards.js       # Credit card CRUD
│   │       └── transactions.js
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CardList.tsx
│   │   │   ├── AddCard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Navbar.tsx
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── services/          # API services
│   │   │   └── api.ts
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── README.md                   # This file
├── SETUP_GUIDE.md             # Detailed setup guide
└── POSTGRESQL_SETUP.md        # PostgreSQL installation guide
```

---

## 🔒 Security

This application implements multiple security measures:

### 🛡️ Authentication & Authorization
- **JWT tokens** with expiration (7 days)
- **Bcrypt password hashing** (10 salt rounds)
- **Token validation** on every protected route
- **User ownership verification** (users can only access their own data)

### 🚨 API Security
- **Rate limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Sets secure HTTP headers
- **CORS**: Restricted to frontend origin
- **Input validation**: All inputs validated before processing
- **SQL injection protection**: Prisma ORM parameterized queries

### 🔐 Best Practices
- **Environment variables** for sensitive data
- **No secrets in code** or version control
- **Error messages** don't reveal sensitive information
- **HTTPS recommended** for production
- **Regular dependency updates**

### ⚠️ Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS (not HTTP)
- [ ] Enable PostgreSQL SSL
- [ ] Set NODE_ENV=production
- [ ] Use strong database passwords
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Use a reverse proxy (nginx)
- [ ] Implement CSRF protection
- [ ] Add input sanitization middleware

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Coding Standards
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes before submitting

---

## 🐛 Troubleshooting

### Backend won't start
- **Check PostgreSQL is running**: `Get-Service -Name "postgresql*"` (Windows)
- **Verify DATABASE_URL** in `.env`
- **Check port 3001** is not in use

### Frontend can't connect
- **Ensure backend is running** on port 3001
- **Check CORS_ORIGIN** matches frontend URL
- **Clear browser cache** and localStorage

### Database migration fails
- **PostgreSQL must be running**
- **Database must exist** (`credit_card_db`)
- **Correct credentials** in DATABASE_URL

For more help, see:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md) - PostgreSQL installation
- [backend/README.md](./backend/README.md) - API documentation

---

## 📈 Future Enhancements

- [ ] Transaction management UI
- [ ] Payment calculator (debt payoff planning)
- [ ] Email notifications for due dates
- [ ] Export data to CSV/PDF
- [ ] Dark mode toggle
- [ ] Multi-language support (Turkish/English)
- [ ] Mobile app (React Native)
- [ ] Credit score tracking integration
- [ ] Budget planning features
- [ ] Recurring payment reminders
- [ ] Interest calculation over time
- [ ] Payment history analytics

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) - Amazing database toolkit
- [React](https://react.dev/) - The library for web and native interfaces
- [Express](https://expressjs.com/) - Fast, unopinionated web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible charting

---

## 📞 Support

If you have any questions or need help, please:
1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review [Troubleshooting](#-troubleshooting) section
3. Open an issue on GitHub
4. Contact via email

---

<div align="center">

**Made with ❤️ and ☕**

[⬆ Back to Top](#-credit-card-debt-tracker)

</div>
