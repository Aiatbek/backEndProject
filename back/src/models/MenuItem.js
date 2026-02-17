import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    }, 
    imageUrl: {
      type: String,
      default: ""
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
}, {timestamps: true});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;