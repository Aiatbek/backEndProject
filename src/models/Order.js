import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        priceAtOrderTime: {
          type: Number,
          required: true
        }
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending"
    },

    type: {
      type: String, //dead code for now.
      enum: ["pickup", "delivery"], 
      default: "pickup"
    },

    address: {  //dead code for now.
      type: String, 
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);