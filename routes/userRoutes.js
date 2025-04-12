const express = require('express');
const router = express.Router();
const { login, getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

// Endpoint público para registrar usuarios
router.post('/register', createUser);

// Endpoints protegidos (requieren autenticación)
router.post('/login', login);
router.get('/users', authenticate, getUsers);
router.post('/users', authenticate, createUser); // Este endpoint sigue protegido
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);

module.exports = router;
