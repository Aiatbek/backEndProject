import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }, 
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 120,
    },
    addressLine1: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },
    addressLine2: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },
    city: {
      type: String,
      trim: true,
      default: "Houston",
      maxlength: 80,
    },
    state: {
      type: String,
      trim: true,
      default: "TX",
      maxlength: 30,
    },
    zip: {
      type: String,
      trim: true,
      default: "",
      maxlength: 20,
    },

    // Hours (simple text so you can display easily)
    hoursText: {
      type: String,
      trim: true,
      default: "Mon–Sun: 12:00 PM – 10:00 PM",
      maxlength: 300,
    },

    // Social links
    instagramUrl: { type: String, trim: true, default: "" },
    tiktokUrl: { type: String, trim: true, default: "" },
    facebookUrl: { type: String, trim: true, default: "" }
});

const Home = mongoose.model("Home", homeSchema);

export default Home;
