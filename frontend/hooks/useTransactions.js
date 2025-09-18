import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001/api"     // Android Emulator
    : "http://192.168.18.3:5001/api"; // iOS simulator or physical device

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expense: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
        const response = await fetch(`${API_URL}/transactions/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
        } catch (error) {
        console.error("Error fetching transactions:", error);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
        const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch summary");
        const data = await response.json();
        setSummary(data); // ✅ fixed
        } catch (error) {
        console.error("Error fetching summary:", error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
        await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
        console.error("Error loading data:", error);
        } finally {
        setLoading(false);
        }
    }, [fetchTransactions, fetchSummary]);

    const deleteTransaction = async (id) => {
        try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete transaction");
        await loadData(); // ✅ refresh after delete
        Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
        console.error("Error deleting transaction:", error);
        }
    };

    return { transactions, summary, loading, loadData, deleteTransaction };
    };
