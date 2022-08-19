import React from 'react'
import { Redirect } from 'react-router-dom'
export default function Protected({ children }) {
    const isAuthenticated = localStorage.getItem('company');
    return isAuthenticated ? (
        children) : ( 
        <Redirect to={{ pathname: '/login' }} />
    );
}

