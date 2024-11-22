
import connectDB from "./utils/db.js";
import  app  from "./app.js";
import dotenv from 'dotenv'
dotenv.config()



// Create server
app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
    connectDB();
}).on('error', (error) => {
    console.error('Error starting the server:', error);
});
