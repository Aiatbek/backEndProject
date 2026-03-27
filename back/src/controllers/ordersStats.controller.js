import Order from "../models/Order.js";

// GET /api/orders/stats (admin)
 const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ["confirmed", "preparing", "ready", "completed"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load order stats" });
  }
};

export default getOrderStats;