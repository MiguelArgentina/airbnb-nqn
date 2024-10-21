// src/Router.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionFormPage from "./pages/TransactionFormPage";
import TransactionListPage from "./pages/TransactionListPage";
import EditTransactionPage from "./pages/EditTransactionPage";
import IncomeSummaryPage from "./pages/IncomeSummaryPage";
import LoginPage from "./pages/LoginPage";
import ForbiddenPage from "./pages/ForbiddenPage"; // Optional
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AppRouter = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setUser(user);
            } else {
                // User is signed out
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forbidden" element={<ForbiddenPage />} />

                {/* Protected Routes */}
                <Route path="/" element={user ? <TransactionListPage /> : <LoginPage />} />
                <Route path="/transactionFormPage" element={user ? <TransactionFormPage /> : <LoginPage />} />
                <Route path="/edit-transaction/:id" element={user ? <EditTransactionPage /> : <LoginPage />} />
                <Route path="/income-summary" element={user ? <IncomeSummaryPage /> : <LoginPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
