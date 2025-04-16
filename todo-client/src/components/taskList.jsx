import { useState, useEffect } from 'react';

export default function TaskList({ tasks, onUpdate, updatingId, currentUserId, onDelete }) {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [localTasks, setLocalTasks] = useState(tasks);

    // Synchronise localTasks quand tasks change
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const handleEdit = (task) => {
        setEditingId(task.id);
        setEditValue(task.title);
    };

    const handleSaveEdit = async (taskId) => {
        try {
            await onUpdate(taskId, { title: editValue });
            setLocalTasks(localTasks.map(task => 
                task.id === taskId ? { ...task, title: editValue } : task
            ));
            setEditingId(null);
        } catch (error) {
            console.error("Échec de la mise à jour:", error);
        }
    };

    const handleToggleComplete = async (taskId, completed) => {
        try {
            await onUpdate(taskId, { completed });
            setLocalTasks(localTasks.map(task => 
                task.id === taskId ? { ...task, completed } : task
            ));
        } catch (error) {
            console.error("Échec de la mise à jour:", error);
        }
    };

    return (
        <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-4">Liste des tâches</h2>
            
            {localTasks.length === 0 ? (
                <p className="text-gray-500">Aucune tâche à afficher</p>
            ) : (
                <ul className="space-y-3">
                    {localTasks.map(task => (
                        <li 
                            key={task.id} 
                            className={`p-4 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'}`}
                        >
                            <div className="flex justify-between items-start">
                                {/* Titre de la tâche */}
                                {editingId === task.id ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 mr-2 p-1 border rounded"
                                        autoFocus
                                    />
                                ) : (
                                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                        {task.title}
                                    </span>
                                )}

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={task.completed || false}
                                        onChange={() => handleToggleComplete(task.id, !task.completed)}
                                        disabled={updatingId === task.id}
                                        className="h-5 w-5"
                                    />

                                    {/* Boutons d'édition */}
                                    {editingId === task.id ? (
                                        <>
                                            <button 
                                                onClick={() => handleSaveEdit(task.id)}
                                                className="text-green-600 hover:text-green-800"
                                                disabled={updatingId === task.id}
                                            >
                                                ✓
                                            </button>
                                            <button 
                                                onClick={() => setEditingId(null)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                ✗
                                            </button>
                                            
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleEdit(task)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ✎
                                        </button>
                                    )}
                                        <button
                                            onClick={() => typeof onDelete === 'function' && onDelete(task.id)}
                                            className="text-red-600 hover:text-red-800"
                                            disabled={updatingId === task.id}
                                            aria-label="Supprimer"
                                        >
                                        🗑️
                                        </button>
                                </div>
                            </div>

                            {/* Métadonnées */}
                            <div className="mt-2 text-sm text-gray-500 flex justify-between">
                                <span>
                                    {task.user?.name || 'Utilisateur inconnu'}
                                    {task.user?.id === currentUserId && " (Vous)"}
                                </span>
                                <span>
                                    {task.created_at}
                                    {console.log((task.created_at))}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}