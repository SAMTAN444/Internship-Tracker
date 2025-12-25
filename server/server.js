import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import { protect } from "./middleware/authMiddleware.js"
import internshipRoutes from "./routes/internshipRoutes.js"

dotenv.config();

const app = express();



// Its okay for other websites to talk to me
app.use(cors({
    origin: "*"
}));

// If someone sends me JSON, please decode it for me
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.get("/api/me", protect, (req, res) => {
    res.json(req.user);
})


app.get("/", (req, res) => {
    res.send("API running");
});



const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
});

