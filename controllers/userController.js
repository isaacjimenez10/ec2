const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const createUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    await pool.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login, getUsers, createUser, updateUser, deleteUser };