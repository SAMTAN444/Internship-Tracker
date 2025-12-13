import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

dotenv.config();
connectDB();

const app = express();

// Its okay for other websites to talk to me
app.use(cors());

// If someone sends me JSON, please decode it for me
app.use(express.json());


app.get("/", (req, res) => {
    res.send("API running");
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
