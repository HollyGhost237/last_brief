import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './index.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: "",
        password: '',
        password_confirmation: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await axios.post('http://localhost:8000/api/register', formData);
            
            // Stockage du token Sanctum
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Redirection vers le dashboard
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Registration error:', error);
                alert('Une erreur est survenue lors de l\'inscription');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.name && 
                    formData.email && 
                    formData.password && 
                    formData.password === formData.password_confirmation;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-600">Créer un compte</h2>
                
                {/* Champ Nom */}
                <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">Nom</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
                </div>

                {/* Champ Email */}
                <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
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
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                </div>

                {/* Confirmation mot de passe */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-gray-700 mb-2">Confirmez le mot de passe</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    {formData.password && formData.password !== formData.password_confirmation && (
                        <p className="text-red-500 text-sm">Les mots de passe ne correspondent pas</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`w-full py-2 rounded-md text-white font-medium ${
                        !isFormValid || isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                </button>
            </form>
        </div>
    );
}