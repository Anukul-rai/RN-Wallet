import { Redirect, Stack } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'

export default function Layout() {
    const { isSignedIn,isLoaded } = useUser()

    // Wait for Clerk to finish loading before rendering
    if (!isLoaded) {
        return null
    }
    if (!isSignedIn) {
        return <Redirect href={'/sign-in'} />
    }

    return <Stack  screenOptions={{headerShown:false}}/>
}