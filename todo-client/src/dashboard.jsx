import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import axios from './services/api';
import TaskForm from './components/taskForm';
import TaskList from './components/taskList';
import CollaboratorsList from './components/CollaboratorsList';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // Récupère toutes les tâches
    const fetchTasks = async () => {
        try {
            const post = await axios.get('/posts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            console.log(post.data);
            setTasks(post.data);
        } catch (err) {
            console.error("Erreur tâches:", err.response?.data);
            setError(err.response?.data?.message || "Erreur lors du chargement des tâches");
        } finally {
            setLoading(false);
        }
    };

    // Récupère les collaborateurs
    const fetchCollaborators = async () => {
        try {
            const data = await axios.get('/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            console.log("Resultat de data: ",data.data);
            setCollaborators(data.data.users.filter(u => u.id !== user.id));
        } catch (err) {
            console.log("Erreur collaborateurs:", err.response?.data);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchCollaborators();
    }, []);

    // Ajoute une nouvelle tâche
    const handleAddTask = async (taskData) => {
        try {
            const data = await axios.post('/posts', {
                title: taskData.title,
                completed: false,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            fetchTasks(); // Recharger les tâches après ajout
            setTasks([data, ...tasks]);
        } catch (err) {
            console.error("Erreur création:", err.response?.data);
            setError(err.response?.data?.message || "Échec de l'ajout");
        }
    };

    // Supprime une tâche
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`/posts/${taskId}`, {
                headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // Mise à jour optimiste de l'état
            setTasks(tasks.filter(task => task.id !== taskId));
            
            toast.success('Tâche supprimée !');
            } catch (err) {
            toast.error('Échec de la suppression');
            console.error("Détails erreur:", err.response?.data);
            }
        };

    // Met à jour une tâche
    const handleUpdateTask = async (taskId, updates) => {
        setUpdatingId(taskId);
        try {
            // 1. Envoi de la requête API
            const response = await axios.put(`/posts/${taskId}`, updates, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            // 2. Optimistic update immédiat
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === taskId ? { ...task, ...updates } : task
                )
            );
    
            // 3. Vérification côté serveur (optionnel)
            if (response.data?.success !== true) {
                console.warn("La réponse du serveur est inattendue:", response.data);
                fetchTasks(); // Rechargement conservatif
            }
    
        } catch (err) {
            // 4. Rollback en cas d'erreur
            console.error("Erreur détaillée:", {
                status: err.response?.status,
                data: err.response?.data,
                config: err.config
            });
    
            setError(err.response?.data?.message || "Échec de la mise à jour");
            fetchTasks(); // Rechargement pour synchronisation
    
            // 5. Notification utilisateur (optionnel)
            // toast.error("Échec de la mise à jour. Reconnexion...");
            
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">
                    Tableau de bord - {user.name}
                </h1>
                <button 
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Déconnexion
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne 1 : Formulaire et collaborateurs */}
                <div className="lg:col-span-1 space-y-6">
                    <TaskForm onSubmit={handleAddTask} />
                    <CollaboratorsList users={collaborators} />
                </div>

                {/* Colonne 2-3 : Liste des tâches */}
                <div className="lg:col-span-2">
                    <TaskList 
                        tasks={tasks} 
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask} // Utiliser la même fonction pour supprimer
                        updatingId={updatingId}
                        currentUserId={user.id}
                    />
                </div>
            </div>
        </div>
    );
}

// import { useState, useEffect } from 'react';
// import { useAuth } from './contexts/AuthContext';
// import axios from './services/api'; // Votre instance Axios configurée
// import TaskForm from './components/taskForm';
// import TaskList from './components/TaskList';
// import CollaboratorsList from './components/CollaboratorsList';

// export default function Dashboard() {
//     const { user, logout } = useAuth();
//     const [tasks, setTasks] = useState([]);
//     const [collaborators, setCollaborators] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Récupère toutes les tâches
//     const fetchTasks = async () => {
//         try {
//             const { data } = await axios.get('/api/posts', {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             setTasks(data);
//         } catch (err) {
//             console.error("Erreur:", {
//                 status: err.response?.status,
//                 data: err.response?.data,
//                 config: err.config
//             });
//             setError("Erreur lors du chargement des tâches");
//         }
//     };
    
//     const handleAddTask = async (taskData) => {
//         try {
//             const { data } = await axios.post('/api/posts', {
//                 title: taskData.title,
//                 completed: false, // Par défaut non complété
//                 // user_id est automatiquement ajouté par le middleware auth
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
            
//             setTasks(prev => [data, ...prev]);
//         } catch (err) {
//             console.error("Erreur création:", err.response?.data);
//             setError(err.response?.data?.message || "Échec de l'ajout");
//         }
//     };

//     // Récupère les collaborateurs
//     const fetchCollaborators = async () => {
//         try {
//             const { data } = await axios.get('/users', {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             setCollaborators(data.filter(u => u.id !== user.id));
//         } catch (err) {
//             console.error("Erreur collaborateurs:", err);
//             setError("Impossible de charger les collaborateurs");
//         }
//     };

//     useEffect(() => {
//         fetchTasks();
//         fetchCollaborators();
//     }, []);

//     // Met à jour une tâche
//     const handleUpdateTask = async (taskId, updates) => {
//         try {
//         await axios.put(`/posts/${taskId}`, updates);
//         setTasks(tasks.map(t => 
//             t.id === taskId ? { ...t, ...updates } : t
//         ));
//         } catch (err) {
//         setError("Échec de la mise à jour");
//         }
//     };

//     if (loading) return <div>Chargement...</div>;
//     if (error) return <div className="text-red-500">{error}</div>;

//     return (
//         <div className="container mx-auto p-4">
//         <header className="flex justify-between items-center mb-8">
//             <h1 className="text-2xl font-bold">
//             Tableau de bord - {user.name}
//             </h1>
//             <button 
//             onClick={logout}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//             >
//             Déconnexion
//             </button>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Colonne 1 : Formulaire */}
//             <div className="lg:col-span-1">
//             <TaskForm onSubmit={handleAddTask} />
//             <CollaboratorsList users={collaborators} />
//             </div>

//             {/* Colonne 2-3 : Tâches */}
//             <div className="lg:col-span-2">
//             <TaskList 
//                 tasks={tasks} 
//                 currentUserId={user.id}
//                 onUpdate={handleUpdateTask} 
//             />
//             </div>
//         </div>
//         </div>
//     );
// }