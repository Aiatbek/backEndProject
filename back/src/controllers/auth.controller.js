import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, passwordHash: hashedPassword });
        await newUser.save();
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
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
        if(!existingUser){
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if(!isPasswordCorrect){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ message: "Session regeneration failed" });
            }
            req.session.userId = existingUser._id; //it is inside callback of regenerate, because we want to make sure session is 
            // regenerated before assigning userId to it. Because if we assign userId before regeneration, then after regeneration 
            // that userId will be lost and session will be empty.
            res.json({ message: "Login successful", user: { //it is inside callback of regenerate, because we want to make sure session is regenerated and userId is assigned before sending response otherwise it might send old session.
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            } });
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy((err) => { //req.session is attached to that specific request, so server can identify which session to destroy based on the cookie sent by the client.
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("itsSessionCookie"); //it will clear only cookie not 
        res.json({ message: "Logout successful" });//these two are inside callback of destroy, because we want to make sure session is destroyed before 
        // sending response and clearing cookie because req.session.destroy is asynchronous.
    });
};
