var express = require('express');
var router = express.Router();

const authController = require('../controllers/authentication_controller.js');

router.post('/login', function async(req, res, next) {
    authController.login(req, res);
});

module.exports = router;