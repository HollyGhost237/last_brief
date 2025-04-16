import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function CollaboratorsList({ onSelectUser }) {
    const { user: currentUser, auth_token } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/users', {
                    headers: {
                        'Authorization': `Bearer ${auth_token}`
                    }
                });
                setUsers(response.data);
                console.log('Verification reponse',response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        console.log('auth_token verification', auth_token);
        // Vérifiez si l'utilisateur est authentifié avant de récupérer les utilisateurs
        if (auth_token) {
            fetchUsers();
        }
    }, [auth_token]);

    const handleSelect = (userId) => {
        setSelectedUserId(userId);
        onSelectUser?.(userId);
    };

    if (loading) {
        return <div>Chargement des collaborateurs...</div>;
    }

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3 text-lg">Collaborateurs</h3>
            <ul className="space-y-2">
                {/* Option "Tous les utilisateurs" */}
                <li
                    className={`p-2 rounded cursor-pointer ${!selectedUserId ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    onClick={() => handleSelect(null)}
                >
                    <span className="flex items-center">
                        👥 Toutes les tâches
                    </span>
                </li>

                {/* Liste des collaborateurs */}
                {users.map(user => (
                    <li
                        key={user.id}
                        className={`p-2 rounded cursor-pointer ${selectedUserId === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => handleSelect(user.id)}
                    >
                        <span className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                            {user.name}
                            {user.id === currentUser.id && " (Vous)"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}