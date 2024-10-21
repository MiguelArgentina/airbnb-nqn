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
            <h1>Forbidden</h1>
            <p>You do not have permission to view this page.</p>
            <a
                href={"/"}
                className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
                Back to Transactions
            </a>
        </div>
    );
}
