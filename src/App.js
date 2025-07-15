// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar/AppNavbar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Movies from './pages/Movies/Movies';
import Profile from './pages/Profile/Profile'; 
import Home from './pages/Home/Home';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';


function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Add more routes like /movies/:id, etc. */}
      </Routes>
    </>
  );
}

export default App;
