require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.set("trust proxy", 1); // <-- Trust first proxy (required for rate-limit with X-Forwarded-For)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Health-check
app.get("/", (req, res) => {
  res.send("🩺 Server is up and running!");
});

// Routes
const aiRoutes = require("./routes/ai");
const mapRoutes = require("./routes/map");
app.use("/api/ai", aiRoutes);
app.use("/api/map", mapRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
