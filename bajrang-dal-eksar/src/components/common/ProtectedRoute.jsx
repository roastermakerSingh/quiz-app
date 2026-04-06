import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { admin } = useApp();
  return admin ? children : <Navigate to="/login" replace />;
}
