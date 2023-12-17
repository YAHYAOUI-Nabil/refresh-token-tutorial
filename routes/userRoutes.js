const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const verifyJWT = require('../middlewares/verifyJWT');


router.route('/')
      .post(userController.createNewUser)
      .get(verifyJWT, userController.getAllUsers)
      .put(verifyJWT, userController.updateUser)
      .delete(verifyJWT, userController.deleteUser)

module.exports = router;