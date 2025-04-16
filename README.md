# last_brief

#  Todo List Collaborative

Une application full-stack pour gérer vos tâches en équipe avec tableau de bord et fonctionnalités collaboratives.

![Preview](https://via.placeholder.com/800x400?text=TodoList+Preview) *(Remplacez par une vraie capture d'écran)*

##  Fonctionnalités

- ✅ Création/modification/suppression de tâches
- 👥 Visualisation des tâches des autres utilisateurs
- 📊 Tableau de bord avec statistiques
- 🔐 Authentification sécurisée (JWT)
- 🔄 Synchronisation en temps réel
- 🗑️ Suppression avec confirmation

## 🛠️ Technologies

**Frontend:**
- React 19.1
- Axios (API calls)
- Tailwind CSS (Styling)
- Context API (State management)

**Backend:**
- Laravel 12
- Sanctum (Authentification)
- Eloquent ORM
- MySQL/PostgreSQL

##  Installation

### Prérequis
- Node.js 22+
- PHP 8.2+
- Composer
- Base de données MySQL/PostgreSQL

### Backend (Laravel)
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve