const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifyToken');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);
router.post('/change-password', verifyToken, authController.changePassword);





router.post('/logout', (req, res) => {
  // Le client supprimera le token localement
  res.status(200).json({ message: 'Déconnexion réussie' });
});


module.exports = router;
