import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        // Log the failure but keep the server running so it can still serve
        // requests and surface a real error, instead of crash-looping (503).
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB;