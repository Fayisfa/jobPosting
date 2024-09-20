import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ component: Component, roles }) => {
    const { auth } = useContext(AuthContext);

    // If not authenticated, redirect to login
    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    // If user does not have the required role, redirect to home
    if (roles && !roles.includes(auth.role)) {
        return <Navigate to="/" />;
    }

    // Render the protected component
    return <Component />;
};

export default ProtectedRoute;
