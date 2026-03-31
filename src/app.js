import express from "express"
import cors from "cors";
import sessionMiddleware from "./config/session.js";
import menuRoutes from "./routes/menu.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js";
import orderRoutes from "./routes/order.routes.js"
// Every request goes through a pipeline:
// ```
// Request comes in
//       ↓
//   CORS middleware    ← app.use(cors())
//       ↓
// Session middleware  ← app.use(session())
//       ↓
//   Route handler     ← app.use('/api/menu', menuRoutes)
//       ↓
//   Send response
const app = express()
app.set('trust proxy', 1)

/**
 * CORS must be configured BEFORE session middleware and routes.
 * credentials: true  — allows the browser to send/receive cookies cross-origin
 * origin             — must be the exact frontend URL (not "*") when credentials: true
 */
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL 
}));

app.use(express.json());
app.use(sessionMiddleware);

// function sessionMiddleware(req, res, next) {
//   // reads the cookie from req
//   // looks up the session in MongoDB
//   // attaches session data to req.session
//   // calls next() to continue
// }
app.use("/api/home", homeRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// app.js — without routers
// app.get('/api/auth/login', (req, res) => {
//   // all login logic here
// })

// app.post('/api/auth/register', (req, res) => {
//   // all register logic here
// })

export default app
