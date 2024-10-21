// src/pages/ForbiddenPage.js
import React from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
export default function ForbiddenPage() {
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate("/"); // Navigate to root path
    };

    return (
        <div>
            <h1>Acceso denegado</h1>
            <p>No tiene permisos para acceder a esta página.</p>
            <a
                href={"/"}
                className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
                Volver al listado
            </a>
        </div>
    );
}
