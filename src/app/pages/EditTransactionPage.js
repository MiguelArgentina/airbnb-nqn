// src/app/pages/EditTransactionPage.js
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "@/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditTransactionPage = () => {
    const { id } = useParams();
    const [date, setDate] = useState("");
    const [usdIncome, setUsdIncome] = useState(0);
    const [arsIncome, setArsIncome] = useState(0);
    const [usdExpense, setUsdExpense] = useState(0);
    const [arsExpense, setArsExpense] = useState(0);
    const [description, setDescription] = useState("");
    const [exchangeRate, setExchangeRate] = useState(0);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const navigate = useNavigate(); // Initialize the navigate function
    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        const hasUsdValue = usdIncome > 0 || usdExpense > 0;
        const hasArsValue = arsIncome > 0 || arsExpense > 0;

        if (hasUsdValue && hasArsValue) {
            setErrorMessage("You can only add one value in either USD or ARS.");
            return false;
        }

        if (hasUsdValue && exchangeRate === 0) {
            setErrorMessage("Exchange rate is required when a USD value is added.");
            return false;
        }

        if (hasArsValue && exchangeRate !== 0) {
            setErrorMessage("Exchange rate must be empty when an ARS value is added.");
            return false;
        }

        setErrorMessage(""); // Clear error if valid
        return true;
    };

    useEffect(() => {
        const fetchTransaction = async () => {
            const docRef = doc(db, "transactions", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDate(data.date);
                setUsdIncome(data.usdIncome);
                setArsIncome(data.arsIncome);
                setUsdExpense(data.usdExpense);
                setArsExpense(data.arsExpense);
                setDescription(data.description);
                setExchangeRate(data.exchangeRate);
            } else {
                console.log("No such document!");
            }
        };
        fetchTransaction();
    }, [id]);

    const handleUpdate = async () => {
        if (!validateForm()) {
            return;
        }
        const docRef = doc(db, "transactions", id);
        try {
            await updateDoc(docRef, {
                date,
                usdIncome,
                arsIncome,
                usdExpense,
                arsExpense,
                description,
                exchangeRate,
            });
            setMessage("Transaction updated successfully!");
            setMessageType("success");
        } catch (error) {
            console.error("Error updating transaction: ", error);
            setMessage("Error updating transaction. Please try again.");
            setMessageType("error");
        }
    };

    const closeMessage = () => {
        setMessage("");
        setMessageType("");
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-4">
            <h2 className="text-xl text-gray-900 font-semibold mb-4">Edit Transaction</h2>

            {errorMessage && (
                <div className="p-2 mb-4 text-white rounded bg-red-500">
                    {errorMessage}
                </div>
            )}

            {/* Flash message display */}
            {message && (
                <div
                    className={`p-2 mb-4 text-white rounded flex justify-between items-center ${
                        messageType === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    <span>{message}</span>
                    <button
                        onClick={closeMessage}
                        className="ml-2 text-white focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
            )}

            <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
            }} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="usdIncome" className="block text-sm font-medium text-gray-700">USD Income</label>
                    <input
                        type="number"
                        min="0"
                        id="usdIncome"
                        value={usdIncome}
                        onChange={(e) => setUsdIncome(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="arsIncome" className="block text-sm font-medium text-gray-700">ARS Income</label>
                    <input
                        type="number"
                        min="0"
                        id="arsIncome"
                        value={arsIncome}
                        onChange={(e) => setArsIncome(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="usdExpense" className="block text-sm font-medium text-gray-700">USD Expense</label>
                    <input
                        type="number"
                        min="0"
                        id="usdExpense"
                        value={usdExpense}
                        onChange={(e) => setUsdExpense(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="arsExpense" className="block text-sm font-medium text-gray-700">ARS Expense</label>
                    <input
                        type="number"
                        min="0"
                        id="arsExpense"
                        value={arsExpense}
                        onChange={(e) => setArsExpense(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700">Exchange Rate (USD
                        to ARS)</label>
                    <input
                        type="number"
                        min="0"
                        id="exchangeRate"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(Number(e.target.value))}
                        required
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Update Transaction
                </button>
            </form>

            {/* Back to Transactions button */}
            <button
                onClick={() => navigate("/")} // Navigate to the root page
                className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
                Back to Transactions
            </button>
        </div>
    );
};

export default EditTransactionPage;
