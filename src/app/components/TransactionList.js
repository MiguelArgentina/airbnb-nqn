// src/app/components/TransactionList.js
"use client";

import { useRouter } from "next/navigation"; // Import for navigation
import { useEffect, useState } from "react";
import { db } from "@/firebase-config"; // Ensure the correct path
import { collection, getDocs, orderBy, query, where, doc, deleteDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [startDate, setStartDate] = useState(""); // Initialize with default value
    const [endDate, setEndDate] = useState(""); // Initialize with default value
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Initialize router


    const fetchTransactions = async (start, end) => {
        setLoading(true);
        setError(null);
        const startDate = new Date(start);
        const endDate = new Date(end);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        const transactionsCollection = collection(db, "transactions");
        const transactionsQuery = query(
            transactionsCollection,
            where("date", ">=", startDate.toISOString()),
            where("date", "<=", endDate.toISOString()),
            orderBy("date")
        );

        try {
            const transactionSnapshot = await getDocs(transactionsQuery);
            const transactionsList = transactionSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTransactions(transactionsList);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Set default values for the date filters
        setStartDate(startOfMonth.toISOString().split('T')[0]); // Format: YYYY-MM-DD
        setEndDate(endOfMonth.toISOString().split('T')[0]); // Format: YYYY-MM-DD

        fetchTransactions(startOfMonth, endOfMonth);
    }, []);

    const handleFilter = () => {
        if (startDate && endDate) {
            fetchTransactions(new Date(startDate), new Date(endDate));
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, "transactions", id)); // Delete the transaction from Firestore
                setTransactions(transactions.filter((transaction) => transaction.id !== id)); // Remove from state
                alert("Transaction deleted successfully.");
            } catch (error) {
                console.error("Error deleting transaction: ", error);
                alert("Failed to delete transaction. Please try again.");
            }
        }
    };

    if (loading) return <div>Cargando transacciones...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl text-gray-900 font-semibold mb-4">Listado de Transacciones</h2>

            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded text-gray-400"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded text-gray-400"
                />
                <button
                    onClick={handleFilter}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Filtrar
                </button>
            </div>

            {/* Transactions table */}
            {transactions.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-left font-semibold">Date</th>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-left font-semibold">Ingreso USD
                        </th>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-left font-semibold">Ingreso ARS
                        </th>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-left font-semibold">Gasto USD
                        </th>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-left font-semibold">Gasto ARS
                        </th>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-left font-semibold">TC (ARS/USD)
                        </th>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-left font-semibold">
                            Nota
                        </th>
                        <th className="border-b-2 border-gray-300 text-gray-800 px-4 py-2 text-center font-semibold">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="px-4 py-2 text-gray-800">
                                {new Date(transaction.date).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </td>
                            <td className="px-4 py-2 text-gray-800">{transaction.usdIncome}</td>
                            <td className="px-4 py-2 text-gray-800">{transaction.arsIncome}</td>
                            <td className="px-4 py-2 text-gray-800">{transaction.usdExpense}</td>
                            <td className="px-4 py-2 text-gray-800">{transaction.arsExpense}</td>
                            <td className="px-4 py-2 text-gray-800">{transaction.exchangeRate}</td>
                            <td className="px-4 py-2 text-gray-800">{transaction.description}</td>
                            <td className="px-4 py-2 text-gray-800">
                                <div className="flex space-x-4">
                                    <Link to={`/edit-transaction/${transaction.id}`}>
                                        <IconButton aria-label="edit">
                                            <EditIcon style={{color: "#dcd036", fontSize: '2.5rem'}}/>
                                        </IconButton>
                                    </Link>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(transaction.id)}>
                                        <DeleteIcon style={{color: "#f44336", fontSize: '1.8rem'}}/>
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions available.</p>
            )}
        </div>
    );
};

export default TransactionList;
