// src/hooks/useTransactions.js

import { useEffect, useState } from 'react';
import { db } from "@/firebase-config";
import { collection, getDocs, query, where } from 'firebase/firestore';

const useTransactions = (startDate, endDate) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const transactionsRef = collection(db, 'transactions'); // Replace with your actual collection name
                let q;

                if (startDate && endDate) {
                    q = query(transactionsRef, where('date', '>=', new Date(startDate)), where('date', '<=', new Date(endDate)));
                } else {
                    q = query(transactionsRef); // Fetch all transactions if no dates are provided
                }

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [startDate, endDate]);

    return { transactions, loading, error };
};

export default useTransactions;
