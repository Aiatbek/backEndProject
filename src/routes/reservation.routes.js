import Router from "express";
import {
    createReservation,
    getMyReservations,
    getReservations,
    updateReservationStatus,
    deleteReservation
} from "../controllers/reservation.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Customer — create a reservation
router.post("/",   requireAuth, createReservation);

// Customer — view their own reservations
// NOTE: /my must be defined BEFORE /:id so Express doesn't treat "my" as an id
router.get("/my",  requireAuth, getMyReservations);

// Admin — all reservations
router.get("/",    requireAuth, requireAdmin, getReservations);

// Admin — update status
router.patch("/:id/status", requireAuth, requireAdmin, updateReservationStatus);

// Admin — delete
router.delete("/:id", requireAuth, requireAdmin, deleteReservation);

export default router;
