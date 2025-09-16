import React from 'react'
import { StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../constants/colors';

export default function SafeScreen({children}) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{flex:1, backgroundColor:COLORS.background,paddingTop: insets.top}}>
            <StatusBar barStyle="dark-content"/>
            {children}
        </View>
    )
}