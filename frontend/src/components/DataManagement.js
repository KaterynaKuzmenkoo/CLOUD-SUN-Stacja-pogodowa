import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa'; 

function DataManagement({ username, selectedCities, onUpdateCities }) {
    const [newCity, setNewCity] = useState('');
    const [cities, setCities] = useState(selectedCities || []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch(`http://localhost:5000/cities?username=${username}`);
                const data = await response.json();
                if (response.ok) {
                    setCities(data.cities);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Błąd podczas pobierania miast:', error);
                alert('Błąd podczas pobierania miast.');
            }
        };

        if (username) {
            fetchCities();
        }
    }, [username]);

    const handleAddCity = async () => {
        if (newCity && !cities.includes(newCity)) {
            try {
                const response = await fetch('http://localhost:5000/data-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, city: newCity }),
                });

                const data = await response.json();
                if (response.ok) {
                    const updatedCities = [...cities, newCity];
                    setCities(updatedCities);
                    setNewCity('');
                    onUpdateCities(updatedCities); 
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Błąd podczas dodawania miasta:', error);
                alert('Błąd podczas dodawania miasta.');
            }
        } else {
            alert('Miasto już zostało dodane lub nie podano nazwy miasta!');
        }
    };

    const handleDeleteCity = async (city) => {
        try {
            const response = await fetch('http://localhost:5000/data-management', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, city }),
            });

            const data = await response.json();
            if (response.ok) {
                const updatedCities = cities.filter((c) => c !== city);
                setCities(updatedCities);
                onUpdateCities(updatedCities); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania miasta:', error);
            alert('Błąd podczas usuwania miasta.');
        }
    };

    return (
        <div
            className="container mt-4"
            style={{
                maxWidth: '70ex',
                backgroundColor: '#f8f9fa',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <h3 className="mb-4 text-center" style={{ fontWeight: 'bold', color: '#343a40' }}>
                🌆Zarządzanie miastami
            </h3>
            <ul className="list-group mb-4">
                {cities.map((city, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #dee2e6',
                            marginBottom: '0.5rem',
                            padding: '0.8rem 1.2rem',
                        }}
                    >
                        {city}
                        <button
                            className="btn d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: '#D46373', 
                                color: '#fff',
                                borderRadius: '8px', 
                                padding: '0.6rem 0.6rem',
                                border: 'none', 
                                transition: 'background-color 0.2s', 
                                cursor: 'pointer', 
                                width: '40px', 
                                height: '40px', 
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#C25364')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#D46373')}
                            onFocus={(e) => (e.target.style.backgroundColor = '#C25364')}
                            onBlur={(e) => (e.target.style.backgroundColor = '#D46373')}
                            onClick={() => handleDeleteCity(city)}
                        >
                            <FaTrash size={16} title="Usuń miasto" />

                        </button>

                    </li>
                ))}
            </ul>
            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Wpisz nazwę miasta"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    style={{
                        borderRadius: '8px',
                        padding: '0.8rem',
                        border: '1px solid #ced4da',
                        flex: 1,
                    }}
                />
                <button
                    className="btn d-flex align-items-center"
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#3C306E')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#594A9C')} 
                    onFocus={(e) => (e.target.style.backgroundColor = '#013968')} 
                    onBlur={(e) => (e.target.style.backgroundColor = '#594A9C')} 
                    onClick={handleAddCity}
                    style={{
                        backgroundColor: '#594A9C',
                        borderRadius: '8px',
                        padding: '0.8rem 1.2rem',
                        color: '#fff',
                        border: 'none',
                        transition: 'background-color 0.2s',
                    }}
                >
                    ➕ Dodaj miasto
                </button>
            </div>
        </div>
    );
}

export default DataManagement;
