import MenuItem from "../models/MenuItem.js";

export const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ createdAt: -1 });
        console.log("Fetched menu items:", menuItems);
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error });
    }
};

export const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl } = req.body;

        const newMenuItem = new MenuItem({
            name,
            description,
            price,
            category,
            imageUrl
        });

        const savedMenuItem = await newMenuItem.save();
        res.status(201).json(savedMenuItem);
    } catch (error) {
        res.status(500).json({ message: "Error creating menu item", error });
    }
};

export const updateMenuItem = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, description, price, category, imageUrl, isAvailable } = req.body;
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, { name, description, price, category, imageUrl, isAvailable }, { new: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json(updatedMenuItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error });
    }
}

export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
        if (!deletedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting menu item", error });
    }
}
