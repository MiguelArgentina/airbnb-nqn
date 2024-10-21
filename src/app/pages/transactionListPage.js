"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import TransactionList from "../components/TransactionList";
import { Link } from "react-router-dom";
import DateFilter from '../components/DateFilter';
import useTransactions from '../../hooks/useTransactions';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import AddIcon from '@mui/icons-material/Add';
import ReportIcon from '@mui/icons-material/Assessment'; // For a report icon
import LogoutIcon from '@mui/icons-material/Logout'; // Classic logout icon

export default function TransactionListPage() {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { transactions, loading, error } = useTransactions(startDate, endDate);
    const [user, setUser] = useState(null);

    // Set up Firebase auth and detect authentication state
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);  // Set the user if logged in
            } else {
                setUser(null);  // Clear the user if logged out
            }
        });

        return () => unsubscribe();
    }, []);

    // Logout function
    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log("User logged out");
            navigate("/");  // Redirect to home or login page after logout
        }).catch((error) => {
            console.error("Error logging out:", error);
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <div className="flex space-x-5"> {/* Explicitly added space-x-5 */}
                    <button
                        className="w-25 bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600 transition flex items-center gap-2"
                        onClick={() => navigate("/transactionFormPage")}
                    >
                        <AddIcon /> Agregar
                    </button>
                    <Link to="/income-summary">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center gap-2">
                            <ReportIcon /> Ver resumen de ganancias
                        </button>
                    </Link>
                </div>

                {user && (
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition flex items-center gap-2"
                        onClick={handleLogout}
                    >
                        <LogoutIcon /> Desconectar
                    </button>
                )}
            </div>

            <DateFilter startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />

            <TransactionList />
        </div>
    );
}
