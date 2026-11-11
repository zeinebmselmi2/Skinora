const mongoose = require('mongoose');

// Connexion à MongoDB Atlas avec la variable d'environnement MONGO_URI.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
