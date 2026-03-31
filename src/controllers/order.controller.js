import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";
import { sendOrderConfirmation } from "../config/mailer.js";
import { io } from "../index.js";
import { sendTelegramNotification } from '../config/telegram.js'

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, type, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    let totalPrice = 0;
    const processedItems = [];
    const populatedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: "Menu item not available" });
      }
      const quantity = item.quantity;
      const priceAtOrderTime = menuItem.price;
      totalPrice += priceAtOrderTime * quantity;
      processedItems.push({ menuItemId: menuItem._id, quantity, priceAtOrderTime });
      populatedItems.push({ name: menuItem.name, price: priceAtOrderTime, quantity });
    }

    const order = await Order.create({
      userId: req.session.userId,
      items: processedItems,
      totalPrice,
      type,
      address,
    });

    // Populate for socket payload
    const populated = await Order.findById(order._id)
      .populate("items.menuItemId", "name price")
      .populate("userId", "name email phone");

    // Notify admin room — new order arrived
    io.to("admin").emit("newOrder", populated);

    // Send confirmation email — non-blocking
    const user = await User.findById(req.session.userId);
    if (user) {
      sendOrderConfirmation(order, user, populatedItems).catch((err) =>
        console.error("Order email failed:", err.message)
      );
       sendTelegramNotification(
      `🍖 <b>New order!</b>\n👤 ${populated.userId?.name}\n📱 ${populated.userId?.phone}\n💰 $${order.totalPrice.toFixed(2)}\n📋 ${populatedItems.map(i => `${i.quantity}× ${i.name}`).join(', ')}`
    )
    }
    

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};


// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.userId })
      .populate("items.menuItemId", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// GET /api/orders/admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItemId", "name price")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.menuItemId", "name price")
     .populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Notify the specific customer whose order was updated
    io.to(`user_${order.userId._id}`).emit("orderStatusUpdated", order);

    // Also notify admin room so all admin views stay in sync
    io.to("admin").emit("orderStatusUpdated", order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};
