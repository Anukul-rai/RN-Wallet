import { useUser } from '@clerk/clerk-expo'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect } from 'react'
import {styles} from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons';
import SignOutButton from '@/components/SignOutButton'
import PageLoader from '../../components/PageLoader'
import BalanceCard from '../../components/BalanceCard'

export default function Page() {
  const { user } = useUser()
  const {transactions,loading,loadData,deleteTransaction,summary}=useTransactions(user.id)

  useEffect(()=>{
    loadData();
  },[loadData])

  if(loading) return <PageLoader/>

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left */}
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                {/* anukul.rau@gmail.com */}
                {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
              </Text>
            </View>
          </View>
          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* BalanceCard */}
        <BalanceCard summary={summary}/>
      </View>
    </View>
  )
}