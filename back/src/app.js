import express from "express"
import cors from "cors";
import menuRoutes from "./routes/menu.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

const app = express()

app.use(cors());
app.use(express.json());
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);


export default app

// Here:

// Express creates an app object
// You configure it (middleware + routes)
// Then you export that configured app

// So what you export already contains:
// middleware
// routes
// configuration