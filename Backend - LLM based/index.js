const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
require("dotenv").config();

const app = express();


// Middleware to parse JSON request body
app.use(express.json());               // built-in (newer way)
app.use(bodyParser.urlencoded({ extended: true })); // optional if you expect form-data
app.use(cors({ origin: "http://localhost:5173" }));
// Import routes
const predictionRoutes = require("./routes/prediction");
app.use("/", predictionRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
