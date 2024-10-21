"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase-config"; // Ensure the correct path
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const IncomeSummary = () => {
    const [globalIncomeARS, setGlobalIncomeARS] = useState(0);
    const [totalIncomeUSD, setTotalIncomeUSD] = useState(0); // Track total USD income
    const [totalExpenseARS, setTotalExpenseARS] = useState(0);
    const [subtotalUSD, setSubtotalUSD] = useState(0); // New: subtotal for USD incomes
    const [subtotalARS, setSubtotalARS] = useState(0); // New: subtotal for ARS incomes
    const [percentage, setPercentage] = useState(30); // Default percentage
    const [usdManagerRevenue, setUsdManagerRevenue] = useState(0); // USD calculated revenue
    const [arsManagerRevenue, setArsManagerRevenue] = useState(0); // ARS calculated revenue
    const [arsOwnerRevenue, setArsOwnerRevenue] = useState(0); // Final ARS revenue after subtracting percentage
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
            let globalIncomeInARS = 0;
            let totalIncomeInUSD = 0; // Track total USD income
            let totalExpense = 0;
            let usdIncomeSubtotal = 0; // New: subtotal for USD income
            let arsIncomeSubtotal = 0; // New: subtotal for ARS income

            transactionSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const exchangeRate = data.exchangeRate || 1; // Use exchange rate from the record, default to 1 if not available

                usdIncomeSubtotal += data.usdIncome || 0; // Accumulate USD income subtotal
                arsIncomeSubtotal += data.arsIncome || 0; // Accumulate ARS income subtotal

                // Calculate income in both USD and ARS
                totalIncomeInUSD += data.usdIncome || 0; // Track USD income
                globalIncomeInARS += (data.usdIncome || 0) * exchangeRate + (data.arsIncome || 0); // Convert USD income to ARS and add ARS income

                const usdExpenseInARS = (data.usdExpense || 0) * exchangeRate;
                totalExpense += usdExpenseInARS + (data.arsExpense || 0);  // Summing up total expenses in ARS
            });

            setSubtotalUSD(usdIncomeSubtotal); // Set USD subtotal
            setSubtotalARS(arsIncomeSubtotal); // Set ARS subtotal
            setGlobalIncomeARS(globalIncomeInARS);
            setTotalIncomeUSD(totalIncomeInUSD); // Set total USD income
            setTotalExpenseARS(totalExpense);

            // Calculate the revenue based on percentage
            calculateRevenues(globalIncomeInARS, totalIncomeInUSD, totalExpense, percentage, arsIncomeSubtotal);
        } catch (error) {
            console.error("Error fetching transaction data:", error);
            setError("Failed to fetch transaction data");
        } finally {
            setLoading(false);
        }
    };

    const calculateRevenues = (globalIncomeInARS, totalIncomeInUSD, totalExpense, percentage, arsIncomeSubtotal) => {
        const subTotalRevenueARS = globalIncomeInARS - totalExpense; // Total ARS revenue
        const usdManagerCalculatedRevenue = totalIncomeInUSD * (percentage / 100); // USD calculated revenue
        const arsManagerCalculatedRevenue = arsIncomeSubtotal * (percentage / 100); // ARS calculated revenue
        const ownerRevenueARS = subTotalRevenueARS - (subTotalRevenueARS * (percentage / 100)); // Subtract percentage from total revenue

        // Set the values in state
        setUsdManagerRevenue(usdManagerCalculatedRevenue);
        setArsManagerRevenue(arsManagerCalculatedRevenue);
        setArsOwnerRevenue(ownerRevenueARS);
    };

    useEffect(() => {
        const today = new Date();
        const lastDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(startOfMonth.toISOString().split('T')[0]);
        setEndDate(lastDayOfCurrentMonth.toISOString().split('T')[0]);

        fetchData(startOfMonth, lastDayOfCurrentMonth);
    }, []);

    const handleFilter = () => {
        if (startDate && endDate) {
            fetchData(new Date(startDate), new Date(endDate));
        }
    };

    const handlePercentageChange = (e) => {
        const value = e.target.value;
        const newPercentage = parseFloat(value);

        if (value === "") {
            setPercentage(0);
            setUsdManagerRevenue(0);
            setArsManagerRevenue(0);
            setArsOwnerRevenue(0);
        } else if (!isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= 100) {
            setPercentage(newPercentage);
            calculateRevenues(globalIncomeARS, totalIncomeUSD, totalExpenseARS, newPercentage);
        } else {
            setPercentage(0);
            setUsdManagerRevenue(0);
            setArsManagerRevenue(0);
            setArsOwnerRevenue(0);
        }
    };

    const formatNumber = (number) => {
        return number.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    if (loading) return <div>Cargando el resumen...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl text-white font-semibold mb-4">Resumen de ganancias</h2>

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
                    Filtrar
                </button>
            </div>

            <table className="min-w-full bg-white rounded-lg">
                <thead>
                <tr className="border-b bg-gray-800 text-white">
                    <th className="py-2 px-4 text-left">Descripción</th>
                    <th className="py-2 px-4 text-left">Monto (ARS)</th>
                </tr>
                </thead>
                <tbody className="text-gray-900">
                <tr className="border-b">
                    <td className="py-2 px-4">Subtotal USD</td>
                    <td className="py-2 px-4">${formatNumber(subtotalUSD)}</td>
                    {/* New: Subtotal USD */}
                </tr>
                <tr className="border-b">
                    <td className="py-2 px-4">Subtotal ARS</td>
                    <td className="py-2 px-4">{formatNumber(subtotalARS)}</td>
                    {/* New: Subtotal ARS */}
                </tr>
                <tr className="border-b">
                    <td className="py-2 px-4">Ingreso global ([USD -&gt; ARS] + ARS)</td>
                    <td className="py-2 px-4">{formatNumber(globalIncomeARS)}</td>
                </tr>
                <tr className="border-b">
                    <td className="py-2 px-4">Gastos totales (ARS)</td>
                    <td className="py-2 px-4">{formatNumber(totalExpenseARS)}</td>
                </tr>
                <tr className="font-semibold border-b bg-gray-200 text-gray-900">
                    <td className="py-2 px-4">Ganancia bruta (ARS)</td>
                    <td className="py-2 px-4">{formatNumber(globalIncomeARS - totalExpenseARS)}</td>
                </tr>
                </tbody>
            </table>

            <div className="mt-4">
                <label className="text-white text-lg font-semibold">
                    Porcentaje:
                    <input
                        type="number"
                        value={percentage}
                        onChange={handlePercentageChange}
                        className="ml-2 p-2 text-gray-900 rounded"
                    />
                </label>
            </div>

            <div className="mt-4 text-white">
                <span className="text-lg font-semibold">Neto Admin. USD: </span>
                <span className="text-lg font-normal">${formatNumber(usdManagerRevenue)}</span>
            </div>
            <div className="mt-2 text-white">
                <span className="text-lg font-semibold">Neto Admin. ARS: </span>
                <span className="text-lg font-normal">${formatNumber(arsManagerRevenue)}</span>
            </div>
            <div className="mt-2 text-white">
                <span className="text-lg font-semibold">Neto global prop. ARS: </span>
                <span className="text-lg font-normal">${formatNumber(arsOwnerRevenue)}</span>
            </div>
            <button
                onClick={() => navigate("/")} // Navigate to the root page
                className="mt-4 w-full bg-blue-300 text-gray-800 py-2 rounded hover:bg-blue-400 transition"
            >
                Volver al listado
            </button>
        </div>
    );
};

export default IncomeSummary;
