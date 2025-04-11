const express = require('express');
const router = express.Router();
const { login, getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

router.post('/login', login);
router.get('/users', authenticate, getUsers);
router.post('/users', authenticate, createUser);
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);

module.exports = router;