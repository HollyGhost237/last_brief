import { Link } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth(); // Récupère l'état d'authentification

  // Redirection si déjà connecté (optionnel)
    useEffect(() => {
        if (user) {
            window.location.href = '/dashboard';
        }
    }, [user]);

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
        <nav className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-600">TaskCollab</h1>
            <div className="space-x-4">
                <Link 
                to="/login" 
                className="px-4 py-2 text-gray-600 hover:text-green-600 transition"
                >
                Connexion
                </Link>
                <Link
                to="/register"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                S'inscrire
                </Link>
            </div>
            </div>
        </nav>

      {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Gérez vos tâches en équipe <br />
            <span className="text-green-600">simplement</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Collaborez efficacement avec votre équipe en centralisant toutes vos tâches.
            </p>
            <div className="space-x-4">
            <Link
                to="/register"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-medium"
            >
                Commencer gratuitement
            </Link>
            <Link
                to="/features"
                className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition text-lg font-medium"
            >
                Voir les fonctionnalités
            </Link>
            </div>
        </section>

      {/* Features Preview */}
        <section className="max-w-6xl mx-auto px-4 py-16">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Pourquoi choisir TaskCollab ?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
            {[
                {
                icon: '✅',
                title: 'Gestion simple',
                description: 'Créez et organisez vos tâches en quelques clics'
                },
                {
                icon: '👥',
                title: 'Collaboration',
                description: 'Partagez les tâches avec votre équipe'
                },
                {
                icon: '📊',
                title: 'Suivi',
                description: 'Visualisez votre productivité'
                }
            ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
                </div>
            ))}
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t mt-20 py-8">
            <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
            <p>© {new Date().getFullYear()} TaskCollab. Tous droits réservés.</p>
            </div>
        </footer>
        </div>
    );
}