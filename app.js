const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("./config/db_config");
var v1Router = require("./routers/v1_router.js");
const bodyParser = require("body-parser");

dotenv.config();
const port = 4000;
const app = express();

connectToMongoDB();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
var corsOptions = { origin: "*", methods: "GET,POST" };

app.use(express.static("public"));
app.use("/images", express.static("public"));
app.use("/api/v1", cors(corsOptions), v1Router);

app.on("error", (error) => console.error("Server error:", error));
app.listen(port, () => console.log("Server is running on port " + port));
