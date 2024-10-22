// src/app/components/TransactionForm.js

import { useState, useEffect } from "react";
import { db } from "@/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const TransactionForm = () => {
    const [date, setDate] = useState("");
    const [usdIncome, setUsdIncome] = useState(0);
    const [arsIncome, setArsIncome] = useState(0);
    const [usdExpense, setUsdExpense] = useState(0);
    const [arsExpense, setArsExpense] = useState(0);
    const [description, setDescription] = useState("");
    const [exchangeRate, setExchangeRate] = useState(0);
    const [message, setMessage] = useState(""); // State for flash messages
    const [messageType, setMessageType] = useState(""); // State for message type
    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        const hasUsdValue = usdIncome > 0 || usdExpense > 0;
        const hasArsValue = arsIncome > 0 || arsExpense > 0;

        if (hasUsdValue && hasArsValue) {
            setErrorMessage("En una transacción sólo puede cargar o USD o ARS.");
            return false;
        }

        if (hasUsdValue && exchangeRate === 0) {
            setErrorMessage("Debe ingresar un TC al cargar USD.");
            return false;
        }

        if (hasArsValue && exchangeRate !== 0) {
            setErrorMessage("El TC debe ser 0 al cargar ARS.");
            return false;
        }

        setErrorMessage(""); // Clear error if valid
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error("User is not authenticated");
            return; // Exit if the user is not authenticated
        }

        console.log("User is authenticated: ", user.uid); // Log the authenticated user's UID

        try {
            const docRef = await addDoc(collection(db, "transactions"), {
                date,
                usdIncome,
                arsIncome,
                usdExpense,
                arsExpense,
                description,
                exchangeRate,
            });
            console.log("Document written with ID: ", docRef.id);
            setMessage(`Transacción creada! Transaction ID: ${docRef.id}`); // Include transaction ID in success message
            setMessageType("success");

            // Reset form
            setDate("");
            setUsdIncome(0);
            setArsIncome(0);
            setUsdExpense(0);
            setArsExpense(0);
            setDescription("");
            setExchangeRate(0);
        } catch (error) {
            console.error("Error adding document: ", error);
            if (error.code) {
                console.error("Error code: ", error.code);
            }
            if (error.message) {
                console.error("Error message: ", error.message);
            }
            setMessage("Error creando la transacción. Intente nuevamente."); // Error message
            setMessageType("error");
        }
    };

    // Effect to handle auto-close of message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 5000); // Message disappears after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [message]);

    const closeMessage = () => {
        setMessage("");
        setMessageType("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mt-4"
        >
            <h2 className="text-xl text-gray-900 font-semibold mb-4">Agregar transacción</h2>

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
                        &times; {/* Close icon */}
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
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
                    <label htmlFor="usdIncome" className="block text-sm font-medium text-gray-700">Ingreso USD</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        id="usdIncome"
                        value={usdIncome}
                        onChange={(e) => setUsdIncome(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="arsIncome" className="block text-sm font-medium text-gray-700">Ingreso ARS</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        id="arsIncome"
                        value={arsIncome}
                        onChange={(e) => setArsIncome(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="usdExpense" className="block text-sm font-medium text-gray-700">Gasto USD</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        id="usdExpense"
                        value={usdExpense}
                        onChange={(e) => setUsdExpense(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="arsExpense" className="block text-sm font-medium text-gray-700">Gasto ARS</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        id="arsExpense"
                        value={arsExpense}
                        onChange={(e) => setArsExpense(Number(e.target.value))}
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700"> TC (ARS/USD) </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        id="exchangeRate"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(Number(e.target.value))}
                        required
                        className="p-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
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
                    Agregar
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
