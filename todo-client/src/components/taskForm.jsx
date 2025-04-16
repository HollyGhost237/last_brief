import { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        onSubmit({ title });
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nouvelle tâche..."
                className="p-2 border rounded w-full"
            />
            <button 
                type="submit" 
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
                Ajouter
            </button>
        </form>
    );
};

export default TaskForm;