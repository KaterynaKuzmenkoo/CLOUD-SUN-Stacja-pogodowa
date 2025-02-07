import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { FaTrash } from 'react-icons/fa'; 

const AdminPanel = () => {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [selectedUsers, setSelectedUsers] = useState([]); 

    // Pobranie listy użytkowników z backendu
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Błąd pobierania użytkowników:', error.message);
            } finally {
                setLoading(false); 
            }
        };

        fetchUsers();
    }, []);

    // Funkcja do zmiany roli użytkownika
    const handleSetUserRole = async (username, role) => {
        try {
            const response = await fetch('http://localhost:5000/set-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    role,
                    adminUsername: 'KatiaKuzmenko',
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setUsers(users.map(user => (user.username === username ? { ...user, role } : user)));
        } catch (error) {
            console.error('Błąd zmiany roli użytkownika:', error);
        }
    };

    // Funkcja do usunięcia użytkownika
    const handleDeleteUser = async (username) => {
        try {
            const response = await fetch(`http://localhost:5000/${username}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setUsers(users.filter(user => user.username !== username)); 
        } catch (error) {
            console.error('Błąd usuwania użytkownika:', error);
        }
    };

    // Masowe usuwanie użytkowników
    const handleDeleteSelectedUsers = async () => {
        try {
            for (const username of selectedUsers) {
                await fetch(`http://localhost:5000/${username}`, { method: 'DELETE' });
            }
            setUsers(users.filter(user => !selectedUsers.includes(user.username)));
            setSelectedUsers([]); 
        } catch (error) {
            console.error('Błąd masowego usuwania użytkowników:', error);
        }
    };

    const handleSetRoleForSelectedUsers = async (role) => {
        if (!role) {
            console.error("Nie wybrano żadnej roli do ustawienia!");
            return;
        }

        try {
            for (const username of selectedUsers) {
                await fetch('http://localhost:5000/set-role', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username,
                        role,
                        adminUsername: 'KatiaKuzmenko',
                    }),
                });
            }
            setUsers(users.map(user =>
                selectedUsers.includes(user.username) ? { ...user, role } : user
            ));
            setSelectedUsers([]); 
        } catch (error) {
            console.error('Błąd masowej zmiany roli użytkowników:', error);
        }
    };

    
    const toggleSelectUser = (username) => {
        setSelectedUsers(prev =>
            prev.includes(username)
                ? prev.filter(user => user !== username)
                : [...prev, username]
        );
    };

    const selectAllUsers = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]); // Odznacz wszystkich
        } else {
            setSelectedUsers(users.map(user => user.username)); // Zaznacz wszystkich
        }
    };

    return (
        <MDBContainer className="my-4" style={{
            maxWidth: '120ex',
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
            <h3 className="mb-4 text-center" style={{ fontWeight: 'bold', color: '#343a40' }}>
                🖥Panel Administratora
            </h3>
            <div className="mb-3 d-flex justify-content-between">
                <MDBBtn style={{
                    backgroundColor: '#D46373',
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px', 
                }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#C25364')} // Kolor najechania
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#D46373')} 
                    onClick={handleDeleteSelectedUsers}
                    disabled={selectedUsers.length === 0}>
                    Usuń wybranych
                </MDBBtn>
                <select
                    className="form-select d-inline w-auto ms-2"
                    onChange={(e) => handleSetRoleForSelectedUsers(e.target.value)}
                    defaultValue="" 
                    disabled={selectedUsers.length === 0}
                >
                    <option value="" disabled>Wybierz rolę...</option>
                    <option value="User">👤Użytkownik</option>
                    <option value="Admin">📢Administrator</option>
                </select>
            </div>
            <MDBTable hover responsive className="border rounded shadow-sm">
                <MDBTableHead light>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedUsers.length === users.length && users.length > 0}
                                onChange={selectAllUsers}
                            />
                        </th>
                        <th>ID</th>
                        <th>Nazwa</th>
                        <th>Rola</th>
                        <th>Akcje</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={index} className={user.role === 'Admin' ? 'table-info' : ''}>
                                <td>
                                    {user.username !== 'KatiaKuzmenko' && (
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.username)}
                                            onChange={() => toggleSelectUser(user.username)}
                                        />
                                    )}
                                </td>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleSetUserRole(user.username, e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="User">👤Użytkownik</option>
                                        <option value="Admin">📢Administrator</option>
                                    </select>
                                </td>
                                <td>
                                    {user.username !== 'KatiaKuzmenko' && (
                                        <button
                                            className="btn d-flex align-items-center"
                                            style={{
                                                backgroundColor: '#D46373', 
                                                color: '#fff', 
                                                borderRadius: '8px', 
                                                padding: '0.6rem 0.6rem',
                                                border: 'none', 
                                                transition: 'background-color 0.2s', 
                                                cursor: 'pointer', 
                                            }}
                                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#C25364')}
                                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#D46373')} 
                                            onFocus={(e) => (e.target.style.backgroundColor = '#C25364')} 
                                            onBlur={(e) => (e.target.style.backgroundColor = '#D46373')} 
                                            onClick={() => handleDeleteUser(user.username)}
                                        >
                                            <FaTrash title="Usuń użytkownika" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Brak użytkowników</td>
                        </tr>
                    )}
                </MDBTableBody>
            </MDBTable>
        </MDBContainer>
    );
};

export default AdminPanel;
