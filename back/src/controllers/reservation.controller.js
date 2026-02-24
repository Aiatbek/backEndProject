import Reservation from "../models/Reservation.js";

export const createReservation = async (req, res) => {
    try {
        const { name, email, phone, date, time, numberOfGuests, specialRequests } = req.body;
        

        if (!name || !phone || !email || !date || !time || !numberOfGuests) {
        return res.status(400).json({ message: "Missing required fields" });
        }
        const newReservation = new Reservation({
            userId: req.session.userId,
            name,
            email,
            phone,
            date,
            time,
            numberOfGuests,
            specialRequests
        });
        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

//PATCH /api/reservations/:id/status
export const  updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            { status }, 
            { new: true }
        );
        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedReservation = await Reservation.findByIdAndDelete(id);
        if (!deletedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};