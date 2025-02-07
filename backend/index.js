const express = require('express');
const mongoose = require('mongoose'); // Dodaj mongoose
const cors = require('cors'); // Importowanie CORS
const usersRouter = require('./routes/users'); // Endpointy użytkowników

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Dostosuj do potrzeb
}));

// Połączenie z MongoDB
mongoose
  .connect(
    'mongodb+srv://KatiaKuzmenko:haslo123@weatherapp.pd64o.mongodb.net/weatherApp?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Połączono z MongoDB!'))
  .catch(err => console.error('Błąd połączenia z MongoDB:', err));

// Użycie endpointów
app.use(usersRouter); // Obsługuj trasy użytkowników

// Uruchomienie serwera
app.listen(5000, () => {
  console.log('Serwer działa na porcie 5000');
});
