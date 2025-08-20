# Subscription Tracker API

A Node.js API for managing subscription services with automated email reminders and workflow automation.

## 📦 Packages Installed

```bash
npm install express mongoose bcryptjs jsonwebtoken cookie-parser
npm install dotenv nodemailer dayjs
npm install @upstash/workflow @upstash/qstash
npm install arcjet
```

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Chachi444/Subscription-Tracker.git
cd Subscription-Tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.development.local` file:
```bash
PORT=5000
SERVER_URL=http://localhost:5000
NODE_ENV=development
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=2d
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
EMAIL_PASSWORD=your_gmail_app_password
```

4. **Start the server**
```bash
npm start
```

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Subscriptions
- `POST /api/v1/subscriptions` - Create subscription
- `GET /api/v1/subscriptions` - Get all subscriptions
- `GET /api/v1/subscriptions/:id` - Get subscription by ID
- `PUT /api/v1/subscriptions/:id` - Update subscription
- `DELETE /api/v1/subscriptions/:id` - Delete subscription

### Workflows
- `POST /api/v1/workflows/subscription/reminder` - Workflow endpoint
- `POST /api/v1/workflows/test-simple-email` - Test email functionality

## 🛠 Features

- ✅ User authentication with JWT
- ✅ CRUD operations for subscriptions
- ✅ Automated email reminders
- ✅ Security middleware (Arcjet)
- ✅ Workflow automation (Upstash)
- ✅ MongoDB database integration

## 📧 Email Notifications

The system sends automated emails for:
- Subscription creation confirmation
- 7 days before renewal
- 5 days before renewal
- 2 days before renewal
- 1 day before renewal

## 🔐 Security

- JWT token authentication
- Arcjet bot detection and rate limiting
- Password hashing with bcryptjs
- Environment variable protection

## 📱 Deployment

Ready for deployment on Vercel

---
Built with using Node.js and Express
A backend for tracking subscription
