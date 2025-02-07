const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const mongoose = require('mongoose');

// Model użytkownika
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cities: { type: [String], default: [] }, 
    role: { type: String, default: 'User', enum: ['User', 'Admin'] },
},{ versionKey: false }); // Opcjonalnie usuń klucz __v);
const User = mongoose.model('User', UserSchema);

// Endpoint rejestracji
router.post('/register', async (req, res) => {
  try {
      const { username, password } = req.body;

      if (!username || !password) {
          return res.status(400).json({ message: 'Wszystkie pola są wymagane!' });
      }

      // Sprawdzenie, czy użytkownik już istnieje
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Użytkownik już istnieje!' });
      }

      // Haszowanie hasła
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tworzenie nowego użytkownika z rolą Admin dla KatiaKuzmenko
      const role = username === 'KatiaKuzmenko' ? 'Admin' : 'User'; // Automatyczne przypisanie roli Admin

      const newUser = new User({ username, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({ message: 'Rejestracja zakończona sukcesem!' });
  } catch (error) {
      console.error('Błąd rejestracji:', error);
      res.status(500).json({ message: 'Błąd serwera' });
  }
});


// Endpoint logowania
router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      if (!username || !password) {
          return res.status(400).json({ message: 'Wszystkie pola są wymagane!' });
      }

      // Sprawdzenie, czy użytkownik istnieje
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ message: 'Nieprawidłowy login lub hasło!' });
      }

      // Porównanie hasła
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Nieprawidłowy login lub hasło!' });
      }
      
      console.log('Dane zwracane podczas logowania:', { username: user.username, role: user.role });

      // Zwracanie roli i loginu
      res.status(200).json({ username: user.username, role: user.role });
  } catch (error) {
      console.error('Błąd logowania:', error);
      res.status(500).json({ message: 'Błąd serwera' });
  }

});

// Endpoint zarządzania danymi
router.post('/data-management', async (req, res) => {
  try {
      const { username, city } = req.body;

      if (!city) {
          return res.status(400).json({ message: 'Miasto jest wymagane!' });
      }

      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ message: 'Użytkownik nie istnieje!' });
      }

      // Dodaj miasto do listy miast
      if (!user.cities.includes(city)) {
          user.cities.push(city);
          await user.save();
          res.status(200).json({ message: 'Miasto zostało dodane!' });
      } else {
          res.status(400).json({ message: 'To miasto już zostało dodane!' });
      }
  } catch (error) {
      console.error('Błąd dodawania miasta:', error);
      res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Endpoint pobierania miast
router.get('/cities', async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
      return res.status(400).json({ message: 'Użytkownik nie istnieje!' });
  }
  res.status(200).json({ cities: user.cities });
});

// Endpoint zmiany roli użytkownika
router.post('/set-role', async (req, res) => {
  try {
      const { username, role, adminUsername } = req.body;

      // Sprawdzenie, czy użytkownik wykonujący zmianę jest administratorem
      const adminUser = await User.findOne({ username: adminUsername });
      if (!adminUser || adminUser.role !== 'Admin') {
          return res.status(403).json({ message: 'Brak uprawnień do zmiany ról.' });
      }

      // Znalezienie użytkownika i zmiana roli
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ message: 'Użytkownik nie istnieje!' });
      }

      user.role = role;
      await user.save();

      res.status(200).json({ message: 'Rola użytkownika została zmieniona!' });
  } catch (error) {
      console.error('Błąd zmiany roli:', error);
      res.status(500).json({ message: 'Błąd serwera' });
  }
});

// NOWY Endpoint: Pobieranie wszystkich użytkowników
router.get('/users', async (req, res) => {
    console.log("GET /users endpoint was hit"); // Dodaj log
    try {
        const users = await User.find({}, { password: 0 });
        console.log("Users fetched from database:", users); // Loguj pobranych użytkowników
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Brak użytkowników w systemie.' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error); // Log błędów
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

// Endpoint usuwania miasta
router.delete('/data-management', async (req, res) => {
    try {
        const { username, city } = req.body;

        console.log('Otrzymano dane w żądaniu DELETE:', { username, city }); // Logowanie danych

        if (!city) {
            return res.status(400).json({ message: 'Miasto jest wymagane!' });
        }

        // Znajdź użytkownika, ale bez błędu, jeśli go brak
        const user = await User.findOne({ username });

        if (user) {
            const cityIndex = user.cities.indexOf(city);
            if (cityIndex > -1) {
                user.cities.splice(cityIndex, 1);
                await user.save();
                return res.status(200).json({ message: 'Miasto zostało usunięte!' });
            }

            return res.status(400).json({ message: 'To miasto nie istnieje na liście!' });
        }

        // Jeśli użytkownik nie istnieje, usuń miasto na wyższym poziomie logiki lub ignoruj błąd
        return res.status(400).json({ message: 'Nie znaleziono użytkownika, ale miasto nie zostało usunięte.' });

    } catch (error) {
        console.error('Błąd usuwania miasta:', error);
        return res.status(500).json({ message: 'Błąd serwera' });
    }
});
// Endpoint usuwania użytkownika
router.delete('/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie istnieje!' });
        }
  
        res.status(200).json({ message: 'Użytkownik został usunięty' });
    } catch (error) {
        console.error('Błąd usuwania użytkownika:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
  });
module.exports = router;
