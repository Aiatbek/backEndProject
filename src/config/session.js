import session from "express-session";
import MongoStore from "connect-mongo";


const sessionMiddleware = session({
    name: "itsSessionCookie", //what i see in browser dev tools.
    secret: process.env.SESSION_SECRET, //used to sign the sesssion id -> abc123(ex sessionID) + secret = kj4320(ex signature). abc123.kj4320 will be stored in cookie.
    resave: false, //if true, will save session to db on every request even if it hasn't changed.
    saveUninitialized: false, //if true, will save uninitialized sessions to the store.
    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 60 * 60 * 24 * 30, // 30 days in seconds
  }),
    cookie: {
    httpOnly: true, //only browser can read cookie, prevents js access by document.cookie, helps against XSS attacks.
    secure: process.env.NODE_ENV === 'production',//localhost doesn't have HTTPS, so secure should be false in development
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
})
//lax (development) — browser sends cookie for same-origin requests. Works fine locally since frontend and backend are both localhost.
//none (production) — browser sends cookie even for cross-origin requests. Required because my frontend (Vercel) and backend (Railway) are on different domains.
export default sessionMiddleware;

// This file sets up session management using express-session and connect-mongo.
// It creates a session middleware that can be used in the Express app to handle user sessions.
// The sessions are stored in MongoDB, and the configuration includes security settings for cookies.
