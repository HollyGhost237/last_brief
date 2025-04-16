import { useState } from 'react';
import TaskForm from '../components/taskForm';
import TaskList from '../components/taskList';
import '../../src/index.css';

const ListPage = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Apprendre React", completed: false },
        { id: 2, title: "Préparer le backend", completed: true },
    ]);

    const addTask = (title) => {
        setTasks([...tasks, { id: Date.now(), title, completed: false }]);
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
    <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ma Todo List</h1>
        <TaskForm onAdd={addTask} />
        <TaskList 
            tasks={tasks} 
            onDelete={deleteTask} 
            onToggle={toggleTask} 
        />
    </div>
    );
};

export default ListPage;