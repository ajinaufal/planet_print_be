const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
const port = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
var corsOptions = { "origin": "*", "methods": "GET,POST" }

app.on('error', (error) => console.error('Server error:', error));
app.listen(port, () => console.log('Server is running on port ' + port));