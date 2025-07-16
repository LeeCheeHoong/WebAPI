import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  useEffect(()=>{
  },[])

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;