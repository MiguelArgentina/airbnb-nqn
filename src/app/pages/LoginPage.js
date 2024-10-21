import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const LoginPage = () => {
    const handleLogin = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            // User signed in
            const user = result.user;
            console.log("User logged in2:");
            console.log(user.email);
            console.log("User logged in1:", user);
            // Handle successful login (e.g., redirect or update state)
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-8">Inicie sesión para tener acceso a la app</h1>
            <button onClick={handleLogin} className="focus:outline-none">
                <img
                    src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
                    alt="Google Sign-In"
                    className="w-64"
                />
            </button>
        </div>
    );
};

export default LoginPage;
