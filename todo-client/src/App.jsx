// App.jsx
import { Routes, Route } from 'react-router';
import HomePage from './HomePage';
import LoginPage from './pages/loginPage';
import Register from './register';
import  Dashboard  from './dashboard';
import RequireAuth from './components/auth/RequireAuth';

function App() {
  return (
    // <Routes>
    //   <Route path="/" element={<HomePage />} />
    //   <Route path="/login" element={<LoginPage />} />
    // </Routes>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } 
        />
      </Routes>
  );
}

export default App;

// <>
//   <Routes>
//     <Route path='/' element = {<Register />}/>
//     <Route path='/dashboard' element = {<Dashboard />}/>
//     <Route path='/login' element = {<Login />}/>
//   </Routes>
// </>