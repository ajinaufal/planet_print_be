const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const { connectToMongoDB } = require('./config/db_config');
// var v1Router = require('./routers/v1_router.js');
var productRouters = require('./routers/product_routers.js');
const bodyParser = require('body-parser');
const FileHelper = require('./helper/file_helper');

const environment = process.env.NODE_ENV || 'development';
const envFile = `.env.${environment}`;
dotenv.config({ path: envFile });

// console.log('env', environment)

const port = 4000;
const app = express();

connectToMongoDB();

FileHelper.init();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
var corsOptions = { origin: '*', methods: 'GET,POST,PUT,DELETE' };

app.use(express.static('public'));
app.use('/images', express.static('public'));
app.use('/api/v1/product', cors(corsOptions), productRouters);
// app.use('/api/v1', cors(corsOptions), v1Router);

app.on('error', (error) => console.error('Server error:', error));
app.listen(port, () => console.log('Server is running on port ' + port));
