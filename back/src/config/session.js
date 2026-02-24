import session from "express-session";
import MongoStore from "connect-mongo";


const sessionMiddleware = session({
    name: "itsSessionCookie",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 60 * 60 * 24, // 1 day in seconds
  }),
    cookie: {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
})

export default sessionMiddleware;

// This file sets up session management using express-session and connect-mongo.
// It creates a session middleware that can be used in the Express app to handle user sessions.
// The sessions are stored in MongoDB, and the configuration includes security settings for cookies.
