import express from "express"
import cors from "cors";
import menuRoutes from "./routes/menu.routes.js";

const app = express()

app.use(cors());
app.use(express.json());
app.use("/api/menu", menuRoutes);


export default app

// Here:

// Express creates an app object
// You configure it (middleware + routes)
// Then you export that configured app

// So what you export already contains:
// middleware
// routes
// configuration