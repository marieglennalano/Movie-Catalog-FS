// src/pages/Movies/Movies.js
import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import UserView from '../../components/UserView/UserView';
import AdminView from '../../components/AdminView/AdminView';
import moviesData from '../../data/moviesData';

export default function Movies() {
  const { user } = useContext(UserContext);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">🎬 Marvel Movie Catalog</h1>
      {
        user && user.isAdmin
          ? <AdminView moviesData={moviesData} />
          : <UserView moviesData={moviesData} />
      }
    </div>
  );
}
