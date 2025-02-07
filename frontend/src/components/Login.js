import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import weather2 from './img/weather2.jpg';
function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Otrzymane dane:', data);

                onLogin(data);

                if (data.role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/data-management');
                }

                setUsername('');
                setPassword('');
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Niepoprawne dane logowania.');
            }
        } catch (error) {
            console.error('Błąd podczas logowania:', error);
            setError('Wystąpił błąd. Spróbuj ponownie.');
        }
    };

    return (
        <section className="vh-90 justify-content-center" style={{ backgroundColor: '#f9f9f9' }}>
            <div className="container-fluid w-75" >
                <div className="row">
                    <div className="col-sm-6 text-black">
                        <div className="px-5 ms-xl-4">
                        </div>

                        <div className="d-flex justify-content-center h-custom-3 px-5 ms-xl-4 mt-5 pt-5 pt-xl-3 mt-xl-n5">
                            <form style={{ width: '20rem' }} onSubmit={handleSubmit}>
                                <h3
                                    className="fw-bold mb-3 pb-3"
                                    style={{ letterSpacing: '1px', color: '#343a40' }}
                                >
                                    🔐Logowanie
                                </h3>

                                <div
                                    data-mdb-input-init
                                    className="form-outline mb-4"
                                >
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control form-control-lg"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Login"
                                    />
                                    <label
                                        className="form-label"
                                        htmlFor="username"
                                    >
                                        Login
                                    </label>
                                </div>

                                <div
                                    data-mdb-input-init
                                    className="form-outline mb-4"
                                >
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control form-control-lg"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Hasło"
                                    />
                                    <label
                                        className="form-label"
                                        htmlFor="password"
                                    >
                                        Hasło
                                    </label>
                                </div>

                                <div className="pt-1 mb-4">
                                    <button
                                        data-mdb-button-init
                                        data-mdb-ripple-init
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
                                        Zaloguj się
                                    </button>
                                </div>

                                {error && (
                                    <p style={{ color: 'red' }}>{error}</p>
                                )}

                                <p>
                                    Nie masz jeszcze konta?{' '}
                                    <a href="/register" className="link-info">
                                        Zarejestruj sie tutaj
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>

                    <div className="col-sm-6 px-0 d-none d-sm-block">
                        <img
                            src={weather2}
                            alt="Login image"
                            className="w-100"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'left',
                                height: "89.9vh",
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
