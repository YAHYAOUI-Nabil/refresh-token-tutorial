const express = require('express');
const router = express.Router();

const noteController = require('../controllers/noteController');
const verifyJWT = require('../middlewares/verifyJWT');

router.use(verifyJWT)

router.route('/')
      .post(noteController.createNewNote)
      .get(noteController.getAllNotes)
      .put(noteController.updateNote)
      .delete(noteController.deleteNote)

module.exports = router;