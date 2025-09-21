import { View, Text, Alert } from 'react-native'
import { styles } from '../../assets/styles/home.styles'
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react';
import { API_URL } from '../../constants/api';

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

export default function CreateScreen() {
  const { user } = useUser();
  const[title, setTitle] = useState('');
  const[amount, setAmount] = useState('');
  const[selectedCategory, setSelectedCategory] = useState('');
  const[isExpense, setIsExpense] = useState(true);
  const[loading, setLoading] = useState(false);

  const handleCreate=async()=>{
    //validation
    if(!title.trim()) return Alert.alert('Please fill all the fields');
    if(!amount.trim() || isNaN(parseFloat(amount)|| parseFloat(amount)<=0)) return Alert.alert('Please enter valid amount');
    if(!selectedCategory) return Alert.alert('Please select a category');

    try {
      setLoading(true);
      //formatted amount
      const formattedAmount =isExpense 
      ? -Math.abs(parseFloat(amount)) 
      : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          userId:user.id,
          title,
          amount:formattedAmount,
          category:selectedCategory
        })
      })
      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }
      Alert.alert('Transaction created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    }finally{
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Create</Text>
    </View>
  )
}