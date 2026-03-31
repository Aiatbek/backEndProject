# TASTE OF KBBQ — Backend API

Node.js REST API for the TASTE OF KBBQ restaurant application.

---

## Tech Stack

| Layer   | Technology                                      |
|---------|-------------------------------------------------|
| Runtime | Node.js 18+ · Express 5                         |
| Database| MongoDB · Mongoose                              |
| Auth    | express-session · connect-mongo · bcryptjs      |
| Deploy  | Railway                                         |

---

## Project Structure
```
kbbq-backend/
─ src/
   ├── controllers/    auth, menu, order, reservation, home, orderStats
   ├── models/         User, MenuItem, Order, Reservation, Home
   ├── routes/         auth, menu, order, reservation, home
   ├── middleware/     auth.js
   └── config/         database.js, session.js, mailer.js, telegram.js
```

---
## API Endpoints

### Auth
| Method | Route               | Access | Description         |
|--------|---------------------|--------|---------------------|
| POST   | /api/auth/register  | Public | Create account      |
| POST   | /api/auth/login     | Public | Login, sets session |
| POST   | /api/auth/logout    | Auth   | Destroy session     |
| GET    | /api/auth/me        | Auth   | Get current user    |

### Menu
| Method | Route           | Access | Description   |
|--------|-----------------|--------|---------------|
| GET    | /api/menu       | Public | List all items|
| POST   | /api/menu       | Admin  | Create item   |
| PUT    | /api/menu/:id   | Admin  | Update item   |
| DELETE | /api/menu/:id   | Admin  | Delete item   |

### Reservations
| Method | Route                        | Access | Description       |
|--------|------------------------------|--------|-------------------|
| POST   | /api/reservations            | Auth   | Create reservation|
| GET    | /api/reservations/my         | Auth   | My reservations   |
| GET    | /api/reservations            | Admin  | All reservations  |
| PATCH  | /api/reservations/:id/status | Admin  | Update status     |
| DELETE | /api/reservations/:id        | Admin  | Delete            |

### Orders
| Method | Route                  | Access | Description         |
|--------|------------------------|--------|---------------------|
| POST   | /api/orders            | Auth   | Place order         |
| GET    | /api/orders/my         | Auth   | My orders           |
| GET    | /api/orders/admin      | Admin  | All orders          |
| GET    | /api/orders/stats      | Admin  | Order statistics    |
| PATCH  | /api/orders/:id/status | Admin  | Update order status |

### Home
| Method | Route      | Access | Description       |
|--------|------------|--------|-------------------|
| GET    | /api/home  | Public | Get home content  |
| PUT    | /api/home  | Admin  | Update home content|

---

## Local Development

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and install
```bash
git clone https://github.com/Aiatbek/kbbq-backend.git
cd kbbq-backend
npm install
```

### 2. Environment variables

Create a `.env` file in the root:
```
MONGODB_URI=
SESSION_SECRET=
CLIENT_URL=
PORT= # local only, Railway sets this automatically
ADMIN_EMAIL=
ADMIN_PASSWORD=
GMAIL_USER=
GMAIL_PASS=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

### 3. Seed the admin user
```bash
npm run seed:admin
```

### 4. Start the server
```bash
npm run dev      # runs on (set via PORT in .env)
```

---


## Deployment — Railway

1. Push this repo to GitHub
2. Go to (https://railway.app) → New Project → Deploy from GitHub
3. Select this repo
4. Add environment variables in Railway dashboard:
```
MONGODB_URI=
SESSION_SECRET=
CLIENT_URL=<your vercel frontend URL>
ADMIN_EMAIL=
ADMIN_PASSWORD=
NODE_ENV='production'
```

5. Railway will auto-detect Node.js and deploy. Your API will be at:
   `https://your-app.railway.app`

6. Seed admin on Railway (one-time) — go to Railway dashboard → your service → Shell tab:
```bash
npm run seed:admin
```

### Production CORS

Set `CLIENT_URL` in Railway to Vercel frontend URL

---

## Session Security Checklist (before going live)

- [ ] `SESSION_SECRET` 
- [ ] `cookie.secure = true` in production (HTTPS only)
- [ ] `cookie.sameSite = 'none'` since frontend and backend are on different domains
- [ ] `MONGODB_URI` uses a dedicated Atlas user with least-privilege access
- [ ] Admin password is changed from the default seed value

Update `src/config/session.js` for production:
```js
cookie: {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24
}
```

---

## Scripts
```bash
npm run dev        # start with nodemon
npm start          # start for production
npm run seed:admin # seed the admin user
```
