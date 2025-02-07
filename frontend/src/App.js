import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Register from './components/Register';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); 
    const [selectedCities, setSelectedCities] = useState(['Warsaw']); 

    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        setCurrentUser(userData); 
        console.log('Is logged in:', true);
        console.log('Current user:', userData);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    // Aktualizacja miast
    const updateSelectedCities = (cities) => {
        setSelectedCities(cities);
    };

    return (
        <Router>
            {/* Nawigacja */}
            <nav
                className="navbar navbar-expand-lg navbar-light bg-body-tertiary"
                style={{
                    position: 'fixed', 
                    top: 0, 
                    left: 0,
                    width: '100%',
                    zIndex: 1000, 
                    borderBottom: '1px solid #ddd', 
                    height: "70px",
                }}
            >
                <div className="container-fluid">
                    {/* Logo */}
                    <Link className="navbar-brand me-2" to="/">
                        <span
                            style={{
                                fontSize: '24px', 
                                fontWeight: 'bold',
                                color: '#2B418B', 
                                textTransform: 'uppercase', 
                            }}
                        >
                            Cloud&Sun
                        </span>
                    </Link>

                    {/* Elementy nawigacji */}
                    <div className="collapse navbar-collapse" id="navbarButtonsExample">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Kokpit
                                </Link>
                            </li>
                            {isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/data-management">
                                            Zarządzanie
                                        </Link>
                                    </li>
                                    {currentUser?.role === 'Admin' && (
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin">
                                                Panel Administratora
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                        <div className="d-flex align-items-center">
                            {isLoggedIn ? (
                                <Link className="btn btn-link nav-link" to="/" onClick={handleLogout}>
                                    Wyloguj
                                </Link>
                            ) : (
                                <>
                                    <Link className="btn btn-link nav-link me-3" to="/login">
                                        Zaloguj
                                    </Link>
                                    <Link className="btn btn-link nav-link" to="/register">
                                        Zarejestruj
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Główna zawartość aplikacji */}
            <div
                style={{
                    position: 'absolute', 
                    width: '100%', 
                    top: '70px',
                    left: 0, 
                    right: 0, 
                    bottom: 0,
                    backgroundColor: '#2E438D', 
                }}
            >
                <Routes>
                    <Route path="/" element={<Dashboard cities={selectedCities} />} />
                    <Route
                        path="/login"
                        element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/register"
                        element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/data-management"
                        element={isLoggedIn ? (
                            <DataManagement
                                username={currentUser?.username}
                                selectedCities={selectedCities}
                                onUpdateCities={updateSelectedCities}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )}
                    />
                    <Route
                        path="/admin"
                        element={isLoggedIn && currentUser?.role === 'Admin' ? (
                            <AdminPanel />
                        ) : (
                            <Navigate to="/login" />
                        )}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
