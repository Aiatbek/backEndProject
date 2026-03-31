import Reservation from "../models/Reservation.js";
import { sendReservationConfirmation } from "../config/mailer.js";
import { io } from "../index.js";

// POST /api/reservations
export const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, numberOfGuests, specialRequests } = req.body;

    if (!name || !phone || !email || !date || !time || !numberOfGuests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReservation = new Reservation({
      userId: req.session.userId,
      name, email, phone, date, time, numberOfGuests, specialRequests,
    });

    const savedReservation = await newReservation.save();

    // Notify admin room — new reservation arrived
    io.to("admin").emit("newReservation", savedReservation);

    // Send confirmation email — non-blocking
    sendReservationConfirmation(savedReservation).catch((err) =>
      console.error("Reservation email failed:", err.message)
    );

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reservations/my
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation
      .find({ userId: req.session.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reservations (admin)
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/reservations/:id/status
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Reservation.findByIdAndUpdate(
      id, { status }, { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Notify the customer who owns this reservation
    if (updated.userId) {
      io.to(`user_${updated.userId}`).emit("reservationStatusUpdated", updated);
    }

    // Keep admin views in sync
    io.to("admin").emit("reservationStatusUpdated", updated);

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/reservations/:id
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
