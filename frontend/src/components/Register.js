import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import weather from './img/weather3.jpg'; 
import './App.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (username && password) {
            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    setUsername('');
                    setPassword('');
                    setError('');
                    navigate('/login');
                } else {
                    const error = await response.json();
                    setError(error.message || 'Nie udało się zarejestrować.');
                }
            } catch (err) {
                setError('Wystąpił błąd. Spróbuj ponownie.');
            }
        } else {
            setError('Podaj nazwę użytkownika i hasło.');
        }
    };

    return (
        <section className="vh-90 justify-content-center" style={{ backgroundColor: '#f9f9f9' }}> 
            <div className="container-fluid  w-75">
                <div className="row">
                    <div className="col-sm-6 text-black">
                        <div className="d-flex justify-content-center h-custom-3 px-5 ms-xl-4 mt-5 pt-5 pt-xl-3 mt-xl-n5">
                            <form style={{ width: '20rem' }} onSubmit={handleRegister}>
                                <h3
                                    className="fw-bold mb-3 pb-3"
                                    style={{ letterSpacing: '1px', color: '#343a40' }}
                                >
                                    🔑Rejestracja
                                </h3>

                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control form-control-lg"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Login"
                                    />
                                    <label className="form-label" htmlFor="username">
                                        Login
                                    </label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control form-control-lg"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Hasło"
                                    />
                                    <label className="form-label" htmlFor="password">
                                        Hasło
                                    </label>
                                </div>

                                <div className="pt-1 mb-4">
                                    <button
                                        className="btn btn-lg btn-block"
                                        type="submit"
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#02315E')} 
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#2E438D')}
                                        onFocus={(e) => (e.target.style.backgroundColor = '#02315E')} 
                                        onBlur={(e) => (e.target.style.backgroundColor = '#2E438D')} 
                                        style={{
                                            backgroundColor: '#2E438D',
                                            borderRadius: '8px',
                                            padding: '0.8rem 1.2rem',
                                            color: '#fff',
                                            border: 'none',
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        Zarejestruj się
                                    </button>
                                </div>

                                {error && <p style={{ color: 'red' }}>{error}</p>}

                                <p>
                                    Masz już konto?{' '}
                                    <a href="/login" className="link-info">
                                        Zaloguj się tutaj
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>

                    <div className="col-sm-6 px-0 d-none d-sm-block">
                        <img
                            src={weather}
                            alt="Register image"
                            className="w-100"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                                maxWidth: '100%',
                                height: "89.9vh" 
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
