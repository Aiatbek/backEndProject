import Home from "../models/Home.js";

export const getHomeInfo = async (req, res) => {
    try {
        let homeInfo = await Home.findOne();
        if (!homeInfo) {
            return res.status(404).json({ message: "Home information not found" });
        }
        res.status(200).json(homeInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateHomeInfo = async (req, res) => {
    try {
        const { title, description, image, phone, email, addressLine1, addressLine2, city, state, zip, hoursText, instagramUrl, tiktokUrl, facebookUrl } = req.body;
        let homeInfo = await Home.findOne();    
        if (!homeInfo) {
            homeInfo = new Home({ title, description, image, phone, email, addressLine1, addressLine2, city, state, zip, hoursText, instagramUrl, tiktokUrl, facebookUrl });
        } else {
            homeInfo.title = title;
            homeInfo.description = description;
            homeInfo.image = image;
            homeInfo.phone = phone;
            homeInfo.email = email;
            homeInfo.addressLine1 = addressLine1;
            homeInfo.addressLine2 = addressLine2;
            homeInfo.city = city;
            homeInfo.state = state;
            homeInfo.zip = zip;
            homeInfo.hoursText = hoursText;
            homeInfo.instagramUrl = instagramUrl;
            homeInfo.tiktokUrl = tiktokUrl;
            homeInfo.facebookUrl = facebookUrl;
        }
        await homeInfo.save();
        res.status(200).json(homeInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};