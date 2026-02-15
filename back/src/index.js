import dotenv from "dotenv"
dotenv.config({path: './.env'});

import connectDB from "./config/database.js"
import app from "./app.js"

const startServer = async () =>{
    try{
        await connectDB(); //connects database and waits for function connectDB to finish

        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`server running on port ${process.env.PORT}`)
        })

        app.on("error", (error)=>{                                    
            console.error(error);
            throw error
        })
        // will run any time the Express application emits an "error" event:
        // during startup (for example port conflict)
        // while the server is already running (rare cases where the app object emits an error)

        // However, important detail:
        // Most runtime request errors (route errors, controller errors, DB errors)
        // are NOT caught by app.on("error").
        // Those should be handled by Express error-handling middleware instead.
    }
    catch(er){
        console.error("START FAILED: ", er.message);
        process.exit(1);
        // It catches any error that happens while starting the application, for example:
        // Database connection failed (wrong URI, DB down)
        // Invalid environment variables
        // Port already in use (if thrown in startup flow)
        // Any error thrown inside connectDB() or startup logic
    }
}

startServer();