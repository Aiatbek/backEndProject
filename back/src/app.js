import express from "express"
import cors from "cors";
import sessionMiddleware from "./config/session.js";
import menuRoutes from "./routes/menu.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js";
import orderRoutes from "./routes/order.routes.js"

const app = express()

/**
 * CORS must be configured BEFORE session middleware and routes.
 * credentials: true  — allows the browser to send/receive cookies cross-origin
 * origin             — must be the exact frontend URL (not "*") when credentials: true
 *
 * In production replace http://localhost:5173 with your deployed frontend URL,
 * ideally loaded from process.env.CLIENT_URL
 */
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());
app.use(sessionMiddleware);
app.use("/api/home", homeRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

export default app
