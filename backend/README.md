# Credit Card Debt Tracker - Complete Setup Guide

This guide will help you set up and run the improved Credit Card Debt Tracker application.

## 🎯 What's New - Major Improvements

### Backend Improvements ✅
- **Converted to JavaScript** from TypeScript
- **JWT Authentication** with bcrypt password hashing
- **Security middleware**: Helmet, rate limiting, CORS
- **Protected routes** - all card and transaction routes require authentication
- **Improved error handling** with detailed logging
- **Better validation** for all inputs
- **Environment configuration** with .env support

### Frontend Improvements ✅
- **Full authentication system** with login and register
- **Password-based security** (min 6 characters)
- **JWT token management** with automatic refresh
- **Removed hardcoded user IDs** - now uses authenticated user
- **Better error handling** and loading states
- **Improved UI/UX** for forms and error messages

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** database - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)
- **Git** (optional)

---

## 🚀 Installation Steps

### Step 1: Create PostgreSQL Database

1. Open PostgreSQL command line (psql) or pgAdmin
2. Create a new database:

```sql
CREATE DATABASE credit_card_db;
```

3. Note your database credentials (username, password, host, port)

### Step 2: Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the backend directory:

```bash
# Copy from .env.example
copy .env.example .env
```

4. Edit `.env` file with your settings:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database - UPDATE THIS WITH YOUR CREDENTIALS
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/credit_card_db?schema=public"

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT - CHANGE THIS TO A RANDOM STRING IN PRODUCTION
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-please
JWT_EXPIRES_IN=7d
```

**Important**: Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual PostgreSQL credentials.

5. Generate Prisma Client:

```bash
npm run prisma:generate
```

6. Run database migration to create tables:

```bash
npx prisma migrate dev --name add_password_to_user
```

This will:
- Create the database schema
- Add User, CreditCard, and Transaction tables
- Apply all migrations

7. (Optional) Open Prisma Studio to view your database:

```bash
npm run prisma:studio
```

8. Start the backend server:

```bash
# Development mode (with auto-restart)
npm run dev

# OR production mode
npm start
```

You should see:
```
🚀 Server running on port 3001
📝 Environment: development
```

### Step 3: Frontend Setup

1. Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎮 Using the Application

### 1. Register a New Account

1. Open your browser and go to: `http://localhost:5173`
2. You'll be redirected to the login page
3. Click **"Don't have an account? Register"**
4. Fill in:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: At least 6 characters
5. Click **"Create Account"**

You'll be automatically logged in and redirected to the dashboard.

### 2. Add Your First Credit Card

1. Click **"Kredi Kartlarım"** (My Cards) in the navigation
2. Click **"Yeni Kart Ekle"** (Add New Card)
3. Fill in the card details:
   - **Kart Adı** (Card Name): e.g., "Visa Gold"
   - **Bakiye** (Balance): Current debt amount
   - **Faiz Oranı** (Interest Rate): Annual percentage rate
   - **Son Ödeme Tarihi** (Due Date): Payment due date
   - **Minimum Ödeme** (Minimum Payment): Required minimum payment
4. Click **"Kart Ekle"** (Add Card)

### 3. View Dashboard

- Go to the home page to see:
  - Total debt across all cards
  - Total minimum payment
  - Card balance chart
  - Upcoming payments list

### 4. Logout

- Click your name in the top navigation
- Click **"Çıkış"** (Logout)

---

## 🔧 Development Commands

### Backend Commands

```bash
# Start development server (auto-restart)
npm run dev

# Start production server
npm start

# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Cards

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cards` | Get user's cards | Yes |
| POST | `/api/cards` | Create new card | Yes |
| GET | `/api/cards/:id` | Get card details | Yes |
| PUT | `/api/cards/:id` | Update card | Yes |
| DELETE | `/api/cards/:id` | Delete card | Yes |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/transactions` | Get all transactions | Yes |
| POST | `/api/transactions` | Create transaction | Yes |
| GET | `/api/transactions/card/:cardId` | Get card transactions | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction | Yes |

---

## 🐛 Troubleshooting

### Backend won't start

**Error**: `Error: P1001: Can't reach database server`
- **Solution**: Check your PostgreSQL is running and DATABASE_URL is correct

**Error**: `Error: JWT_SECRET is not defined`
- **Solution**: Make sure your `.env` file exists and has JWT_SECRET defined

### Frontend can't connect to backend

**Error**: Network error or 401 Unauthorized
- **Solution**:
  1. Make sure backend is running on port 3001
  2. Clear browser localStorage and try logging in again
  3. Check browser console for specific error messages

### Database migration fails

**Error**: `Migration failed`
- **Solution**:
  1. Make sure PostgreSQL is running
  2. Drop and recreate the database
  3. Run `npx prisma migrate reset` to start fresh

### Can't login after registration

- Clear browser localStorage
- Make sure backend JWT_SECRET is set
- Check backend console for errors

---

## 📦 Database Schema

### User Table
```
- id (UUID, primary key)
- email (unique)
- name
- password (hashed with bcrypt)
- createdAt, updatedAt
```

### CreditCard Table
```
- id (UUID, primary key)
- name
- balance (current debt)
- interestRate
- dueDate
- minimumPayment
- userId (foreign key → User)
- createdAt, updatedAt
```

### Transaction Table
```
- id (UUID, primary key)
- amount
- type ("payment" or "purchase")
- date
- description (optional)
- cardId (foreign key → CreditCard)
- createdAt, updatedAt
```

---

## 🔒 Security Features

1. **Password Hashing**: All passwords hashed with bcrypt (10 salt rounds)
2. **JWT Authentication**: Secure token-based auth with 7-day expiration
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Helmet**: Security HTTP headers
5. **CORS**: Restricted to frontend origin
6. **Input Validation**: All inputs validated before processing
7. **Protected Routes**: All sensitive routes require authentication

---

## 🎯 Next Steps / Future Improvements

- [ ] Add transaction management UI
- [ ] Payment calculator for debt payoff
- [ ] Email notifications for due dates
- [ ] Export data to CSV/PDF
- [ ] Dark mode
- [ ] Multi-language support (English/Turkish)
- [ ] Mobile app (React Native)
- [ ] Credit score tracking
- [ ] Budget planning features

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review backend console logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

## 📝 License

ISC

---

**Happy tracking! 💳**
