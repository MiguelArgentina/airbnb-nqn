// src/app/components/LogoutButton.js

import { signOut } from "firebase/auth";
import { auth } from "@/firebase-config";

const LogoutButton = ({ onLogout }) => {
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User logged out");
                onLogout(); // Call the onLogout function passed as a prop
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white rounded-full py-2 px-4 hover:bg-red-600 transition"
        >
            Desconectar
        </button>
    );
};

export default LogoutButton;
