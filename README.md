# CLOUD&SUN - stacja pogodowa 🌤
Projekt CLOUD&SUN to aplikacja webowa do monitorowania warunków atmosferycznych w czasie rzeczywistym. Umożliwia użytkownikom podgląd temperatury, wilgotności i ciśnienia.

## Technologie
-  **React.js:** frontend. 
- **Node.js i Express.js:** backend. 
- **MongoDB:** baza danych. 
- **JWT:** mechanizm uwierzytelniania i autoryzacji. 
- **Mongoose:** modelowanie danych w MongoDB. 
- **Weatherbit API:** źródło danych pogodowych.


## Uruchomienie

1. Zainstalować wszystkie zależności:

```sh
npm install
```

2. Backend:

```sh
сd backend
node index.js
```

3. Frontend:

```sh
сd frontend
npm run start
```

## Warstwy systemu

##### Warstwa Frontend 
Frontend został zbudowany przy użyciu biblioteki React.js. Odpowiada za dostarczanie 
interaktywnego interfejsu użytkownika. Użytkownicy mogą: 
- Rejestrować się i logować do systemu. 
- Zarządzać swoimi miastami (dodawać, usuwać i przeglądać). 
- Administratorzy mają dodatkowy dostęp do zarządzania użytkownikami. 
Komunikacja między frontendem a backendem odbywa się za pomocą REST API, co 
umożliwia przesyłanie danych w formacie JSON. 
##### Warstwa Backend 
Backend został stworzony z wykorzystaniem frameworka Express.js dla Node.js. Odpowiada 
za: 
- Obsługę logiki aplikacji. 
- Autoryzację i uwierzytelnianie użytkowników za pomocą tokenów JWT. 
- Operacje na danych w bazie MongoDB. 

Backend oferuje różne endpointy REST API, takie jak: 
- Rejestracja i logowanie użytkowników. 
- Dodawanie i usuwanie miast. 
- Zarządzanie użytkownikami przez administratorów. 

Weatherbit API 
Backend komunikuje się z zewnętrznym API pogodowym Weatherbit w celu pobierania 
aktualnych i prognozowanych danych pogodowych dla miast wybranych przez 
użytkowników. 
##### Warstwa Bazy Danych 
System korzysta z MongoDB, nierelacyjnej bazy danych, do przechowywania danych 
aplikacji. Dane są organizowane w kolekcji Users: przechowuje informacje o użytkownikach (login, hasło, rola). 

## Przepływ danych w systemie 
- **Rejestracja:** Nowy użytkownik wprowadza swoje dane, które są weryfikowane i 
zapisywane w bazie danych. 
- **Logowanie:** Backend sprawdza dane logowania użytkownika i generuje token JWT, 
który umożliwia dostęp do chronionych zasobów. 
- **Zarządzanie danymi użytkownika:** Użytkownik zalogowany może dodawać i 
przeglądać swoje miasta, a administratorzy mogą zarządzać użytkownikami. 
- **Dane pogodowe:** System wysyła żądanie do API Weatherbit, pobiera dane pogodowe, 
a następnie udostępnia je w odpowiedzi na zapytania z frontendu. 
- **Panel administratora:** Administratorzy mają dostęp do specjalnych funkcji zarządzania 
użytkownikami, takich jak zmiana ról lub usuwanie kont. 



