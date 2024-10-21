// src/app/components/TransactionFormPage.js
"use client";

import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";

export default function TransactionFormPage() {
    const navigate = useNavigate();

    return (
        <div>
            <button className={"w-25 m-5 bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600 transition"}
                    onClick={() => navigate("/")}>
                Volver al listado
            </button>
            <TransactionForm />
        </div>
    );
}
