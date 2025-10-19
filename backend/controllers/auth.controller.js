const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  db.query('SELECT * FROM users5 WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l’email :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
        'INSERT INTO users5 (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err) => {
            if (err) {
            console.error('❌ Erreur lors de l’insertion :', err); // Ajoute ceci
            return res.status(500).json({ message: 'Erreur lors de la création du compte' });
            }
            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        }
        );
    } catch (err) {
      console.error('Erreur de hash:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users5 WHERE email = ?', [email], async (err, results) => {
    if (results.length === 0) return res.status(400).json({ message: 'Email invalide' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token });
  });
};
exports.getProfile = (req, res) => {
  const userData = req.user; // Récupéré depuis le middleware
  res.json({ user: userData });
};
exports.changePassword = (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // 1. Vérifie la présence des champs
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // 2. Vérifie que les deux nouveaux mots de passe correspondent
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
  }

  // 3. Vérifie l’ancien mot de passe
  db.query('SELECT password FROM users5 WHERE id = ?', [userId], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(oldPassword, results[0].password);
    if (!valid) return res.status(401).json({ message: 'Ancien mot de passe incorrect' });

    // 4. Hash et mise à jour
    const hashed = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users5 SET password = ? WHERE id = ?', [hashed, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Erreur lors du changement' });
      res.json({ message: 'Mot de passe modifié avec succès' });
    });
  });
};


