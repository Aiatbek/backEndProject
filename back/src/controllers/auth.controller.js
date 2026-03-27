import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const { name, email, password, phone } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, phone, passwordHash: hashedPassword });
        await newUser.save();
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ message: "Session regeneration failed" });
            }
            req.session.userId = existingUser._id;
            res.json({
                message: "Login successful",
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    role: existingUser.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("itsSessionCookie");
        res.json({ message: "Logout successful" });
    });
};

/**
 * GET /api/auth/me
 * Returns the currently logged-in user based on the active session.
 * The frontend calls this on every page load to rehydrate auth state.
 * Returns 401 if no valid session exists.
 */
export const getMe = async (req, res) => {
    try {
        // requireAuth middleware already confirmed req.session.userId exists
        const user = await User.findById(req.session.userId).select('-passwordHash');
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
