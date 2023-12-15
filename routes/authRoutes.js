const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const limiter = require('../middlewares/limiter');


router.route('/signin')
      .post(limiter,authController.signin)


router.route('/logout')
      .post(authController.logout)

router.route('/refresh')
      .post(authController.refresh)
      

module.exports = router;