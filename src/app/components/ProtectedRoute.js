import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const checkAuthorization = async () => {
            const user = auth.currentUser;
            console.log("User exists:", user);
            if (user) {
                // Check if user email exists in users collection
                const userDoc = doc(db, "users", user.email); // Use user.email if it's the document ID
                const userSnapshot = await getDoc(userDoc);

                if (userSnapshot.exists()) {
                    setAuthorized(true);
                } else {
                    console.log("User email not authorized:", user.email);
                    navigate("/forbidden");
                }
            } else {
                navigate("/login");
            }
            setLoading(false);
        };

        checkAuthorization();
    }, [auth, db, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return authorized ? children : null; // Render children if authorized
};

export default ProtectedRoute;
