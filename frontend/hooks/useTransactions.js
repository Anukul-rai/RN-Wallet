import { useCallback, useState } from "react";

const API_URL = "https://localhost:5001/api";

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary,setSummary]=useState({
        balance:0,
        income:0,
        expense:0
    })
    const [loading, setLoading] = useState(true);

    //usecallback is used for performance reasons, to prevent unnecessary re-creations of the function on each render
    const fetchTransactions = useCallback(async () => {
        try{
            const response =await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try{
            const response =await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try{
            // can be run in parrallel
            await Promise.all([fetchTransactions(),fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = async(id)=>{
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }
            // Refresh the transactions list after deletion
            loadData();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    }
    return { transactions, summary, loading, loadData, deleteTransaction };
}