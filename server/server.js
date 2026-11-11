const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedCategories = require('./config/seedCategories');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();

const app = express();

// CLIENT_URL peut contenir plusieurs adresses séparées par une virgule
// (local + adresse Vercel).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Les outils comme Postman n'envoient pas d'origine : on les laisse passer.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origine non autorisée par CORS'));
      }
    }
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Skinora en ligne' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Quatre paramètres : Express reconnaît ainsi un middleware d'erreur.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: err.message || 'Erreur serveur.' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('MONGO_URI et JWT_SECRET sont obligatoires. Voir .env.example.');
    process.exit(1);
  }

  await connectDB();

  try {
    await seedCategories();
  } catch (error) {
    console.error(`Seed catégories : ${error.message}`);
  }

  // Render fournit process.env.PORT. En local, on utilise 5000.
  app.listen(PORT, () => {
    console.log(`Serveur Skinora sur le port ${PORT}`);
  });
};

start();
