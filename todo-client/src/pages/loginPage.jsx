import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import '../index.css'; 

export default function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
        const response = await axios.post('http://localhost:8000/api/login', credentials);
        
        // console.log("Réponse API:", response.data);
        // 1. Stockage du token et des infos utilisateur
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // console.log("Redirection vers /dashboard");
        // 2. Redirection vers le dashboard
        navigate('/dashboard');
        } catch (error) {
        if (error.response?.status === 422) {
            setErrors(error.response.data.errors);
        } else if (error.response?.status === 401) {
            setErrors({ auth: ['Email ou mot de passe incorrect'] });
        } else {
            console.error('Login error:', error);
            alert('Erreur de connexion');
        }
        } finally {
        setIsLoading(false);
        }
    };

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-green-600">Connexion</h2>

            {/* Champ Email */}
            <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md lowercase"
                    required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
            </div>

            {/* Champ Mot de passe */}
            <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                {errors.auth && <p className="text-red-500 text-sm">{errors.auth[0]}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoading || !credentials.email || !credentials.password}
                className={`w-full py-2 rounded-md text-white font-medium ${
                    isLoading || !credentials.email || !credentials.password 
                    ? 'bg-gray-400' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="text-center mt-4">
                <Link 
                    to="/register" 
                    className="text-green-600 hover:underline"
                >
                    Créer un compte
                </Link>
            </div>
        </form>
    </div>
    );
}