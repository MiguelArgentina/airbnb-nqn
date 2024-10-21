// src/app/components/IncomeSummary.js
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase-config"; // Ensure the correct path
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const IncomeSummary = () => {
    const [totalIncomeARS, setTotalIncomeARS] = useState(0);
    const [totalExpenseARS, setTotalExpenseARS] = useState(0);
    const [percentage, setPercentage] = useState(30); // Default percentage
    const [calculatedRevenue, setCalculatedRevenue] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to fetch income and expense data
    const fetchData = async (start, end) => {
        setLoading(true);
        setError(null);
        const startDate = new Date(start);
        const endDate = new Date(end);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCDate(endDate.getUTCDate() + 1); // Include end date

        const transactionCollection = collection(db, "transactions");
        const transactionQuery = query(
            transactionCollection,
            where("date", ">=", startDate.toISOString()),
            where("date", "<=", endDate.toISOString())
        );

        try {
            const transactionSnapshot = await getDocs(transactionQuery);
            let totalIncome = 0;
            let totalExpense = 0;

            transactionSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const exchangeRate = data.exchangeRate || 1; // Use exchange rate from the record, default to 1 if not available

                // Convert USD income and expenses to ARS using the record's exchange rate
                const usdIncomeInARS = (data.usdIncome || 0) * exchangeRate;
                const usdExpenseInARS = (data.usdExpense || 0) * exchangeRate;

                totalIncome += usdIncomeInARS + (data.arsIncome || 0);  // Summing up total income in ARS
                totalExpense += usdExpenseInARS + (data.arsExpense || 0);  // Summing up total expenses in ARS
            });

            setTotalIncomeARS(totalIncome);
            setTotalExpenseARS(totalExpense);

            // Calculate revenue only after totalIncomeARS and totalExpenseARS are set
            calculateTotalRevenue(totalIncome, totalExpense, percentage);
        } catch (error) {
            console.error("Error fetching transaction data:", error);
            setError("Failed to fetch transaction data");
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalRevenue = (totalIncome, totalExpense, percentage) => {
        const totalRevenue = totalIncome - totalExpense; // Total revenue is total income minus total expenses
        const calculatedRevenue = totalRevenue * (percentage / 100);
        setCalculatedRevenue(calculatedRevenue); // Calculate the percentage of total revenue
    };


    // Set default dates when the component mounts
    useEffect(() => {
        const today = new Date();
        const lastDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(startOfMonth.toISOString().split('T')[0]); // Format to 'YYYY-MM-DD'
        setEndDate(lastDayOfCurrentMonth.toISOString().split('T')[0]); // Format to 'YYYY-MM-DD'

        fetchData(startOfMonth, lastDayOfCurrentMonth);
    }, []);

    // Handle filtering
    const handleFilter = () => {
        if (startDate && endDate) {
            fetchData(new Date(startDate), new Date(endDate));
        }
    };


    const handlePercentageChange = (e) => {
        const value = e.target.value;
        const newPercentage = parseFloat(value);

        // Check if the input is empty
        if (value === "") {
            setPercentage(0); // Reset to 0 if the input is empty
            setCalculatedRevenue(0); // Optionally reset calculated revenue
        } else if (!isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= 100) {
            setPercentage(newPercentage);
            calculateTotalRevenue(totalIncomeARS, totalExpenseARS, newPercentage);
        } else {
            // If not a valid number, you may choose to do nothing, or reset to 0.
            setPercentage(0); // Optionally reset to 0 for invalid input
            setCalculatedRevenue(0); // Optionally reset calculated revenue
        }
    };

    const formatNumber = (number) => {
        return number.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    if (loading) return <div>Loading income summary...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl text-white font-semibold mb-4">Income Summary</h2>

            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded text-gray-900"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded text-gray-900"
                />
                <button
                    onClick={handleFilter}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Filter
                </button>
            </div>

            {/* Displaying total income and expenses in a table */}
            <table className="min-w-full bg-white rounded-lg">
                <thead>
                <tr className="border-b bg-gray-800 text-white">
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Amount (ARS)</th>
                </tr>
                </thead>
                <tbody className="text-gray-900">
                <tr className="border-b">
                    <td className="py-2 px-4">Total Income</td>
                    <td className="py-2 px-4">{formatNumber(totalIncomeARS)}</td>
                </tr>
                <tr className="border-b">
                    <td className="py-2 px-4">Total Expenses</td>
                    <td className="py-2 px-4">{formatNumber(totalExpenseARS)}</td>
                </tr>
                <tr className="font-semibold border-b bg-gray-200 text-gray-900">
                    <td className="py-2 px-4">Total Revenue</td>
                    <td className="py-2 px-4">{formatNumber(totalIncomeARS - totalExpenseARS)}</td>
                </tr>
                </tbody>
            </table>

            {/* Input for percentage */}
            <div className="mb-4 mt-4">
                <label className="text-lg font-semibold text-white" htmlFor="percentage">
                    Percentage of Total Revenue:
                </label>
                <input
                    type="number"
                    id="percentage"
                    value={percentage}
                    onChange={handlePercentageChange}
                    className="ml-2 p-2 border rounded text-gray-900 w-20"
                />
            </div>

            {/* Display calculated revenue below the percentage input */}
            <div className="mt-2 text-white">
                <span className="text-lg font-semibold">Calculated Revenue: </span>
                <span>{formatNumber(calculatedRevenue)} ARS</span>
            </div>
            <button
                onClick={() => navigate("/")} // Navigate to the root page
                className="mt-4 w-full bg-blue-300 text-gray-800 py-2 rounded hover:bg-blue-400 transition"
            >
                Back to Transactions
            </button>
        </div>
    );
};

export default IncomeSummary;
