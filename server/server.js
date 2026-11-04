
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_polytechnique_sousse_2026';
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
// ==============================================================================
// 1. GLOBAL MIDDLEWARES : CORS & JSON
// ==============================================================================

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// ==============================================================================
// 2. USERS & ARTICLES DATA
// ==============================================================================

const users = [
  {
    id: 'u1',
    name: 'Dr. Abdelweheb GUEDDES',
    email: 'gueddes@poly.tn',
    password: '123456',
    role: 'Admin'
  },
  {
    id: 'u2',
    name: 'Aya Ben Amor',
    email: 'aya@poly.tn',
    password: '123456',
    role: 'Auteur'
  }
];

let articles = [
  {
    id: '1',
    title: 'Comprendre l’Architecture RESTful & le Protocole HTTP',
    author: 'Aya Ben Amor',
    category: 'Architecture Web',
    createdAt: '2026-10-15T09:30:00Z'
  },
  {
    id: '2',
    title: 'Modélisation NoSQL Avancée avec MongoDB & Mongoose',
    author: 'Sami Trabelsi',
    category: 'Base de Données',
    createdAt: '2026-10-18T14:15:00Z'
  },
  {
    id: '3',
    title: 'Sécurisation des APIs avec Tokens JWT Stateless',
    author: 'Dr. Abdelweheb GUEDDES',
    category: 'Cybersécurité',
    createdAt: '2026-10-22T11:00:00Z'
  }
];

// ==============================================================================
// 3. JWT MIDDLEWARE : PROTECT
// ==============================================================================

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Accès refusé : Token JWT manquant.'
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      message: 'Accès refusé : Token JWT invalide ou expiré.'
    });
  }
};

// ==============================================================================
// 4. AUTHENTICATION ROUTES
// ==============================================================================

// LOGIN
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === (email || '').trim().toLowerCase() &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: 'Identifiants incorrects.'
    });
  }

  const userInfo = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(userInfo, JWT_SECRET, {
    expiresIn: '24h'
  });

  res.status(200).json({
    user: userInfo,
    token
  });
});

// REGISTER
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Nom, email et mot de passe obligatoires.'
    });
  }

  const exists = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (exists) {
    return res.status(409).json({
      message: 'Cet email est déjà utilisé.'
    });
  }

  const newUser = {
    id: 'u' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: 'Auteur'
  };

  users.push(newUser);

  const userInfo = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };

  const token = jwt.sign(userInfo, JWT_SECRET, {
    expiresIn: '24h'
  });

  res.status(201).json({
    user: userInfo,
    token
  });
});

// ==============================================================================
// 5. ARTICLES ROUTES : GET PUBLIC, POST & DELETE PROTECTED
// ==============================================================================

// GET : Public - Everyone can read articles
app.get('/api/articles', (req, res) => {
  res.status(200).json(articles);
});

// POST : Protected - Only authenticated users can publish
app.post('/api/articles', protect, (req, res) => {
  const { title, category } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      message: "Le titre de l'article est obligatoire."
    });
  }

  const newArticle = {
    id: Date.now().toString(),
    title: title.trim(),
    author: req.user.name,
    category: category || 'Architecture Web',
    createdAt: new Date().toISOString()
  };

  articles.unshift(newArticle);

  res.status(201).json(newArticle);
});

// DELETE : Protected - Only authenticated users can delete
app.delete('/api/articles/:id', protect, (req, res) => {
  const index = articles.findIndex(
    (article) => article.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: 'Article introuvable.'
    });
  }

  const deleted = articles.splice(index, 1)[0];

  res.status(200).json({
    message: 'Article supprimé.',
    id: deleted.id
  });
});

// ==============================================================================
// 6. START SERVER
// ==============================================================================

app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🚀 MERN Server - Séance 6 (JWT)');
  console.log(`👉 http://localhost:${PORT}`);
  console.log('🔑 Demo: gueddes@poly.tn | Password: 123456');
  console.log('====================================================');
});
