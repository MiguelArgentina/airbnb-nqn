// src/app/components/LoginButton.js
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase-config";

const LoginButton = ({ onLogin }) => {
    const handleLogin = () => {
        signInWithPopup(auth, provider) // Use signInWithRedirect instead
            .then(() => {
                // This will not be called immediately, as redirect happens
                console.log("Redirecting to login...");
            })
            .catch((error) => {
                console.error("Login error:", error);
            });
    };

    return (
        <button
            onClick={handleLogin}
            className="bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600 transition"
        >
            Acceda con Google
        </button>
    );
};

export default LoginButton;
