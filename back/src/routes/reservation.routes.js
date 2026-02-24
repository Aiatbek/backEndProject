import Router from "express";
import { createReservation, getReservations, updateReservationStatus, deleteReservation } from "../controllers/reservation.controller.js";
import { requireAuth, requireAdmin} from "../middleware/auth.js";
const router = Router();

router.post("/", requireAuth, createReservation);
router.get("/", requireAuth, requireAdmin, getReservations);
router.patch("/:id/status", requireAuth, requireAdmin, updateReservationStatus);
router.delete("/:id", requireAuth, requireAdmin, deleteReservation);

export default router;
