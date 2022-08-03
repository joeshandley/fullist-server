require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

const listsRouter = require("./routes/lists.js");
app.use("/lists", listsRouter);

// Listen to port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚢 Server is running on port ${PORT} 🚢`);
});
