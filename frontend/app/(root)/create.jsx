import { View, Text } from 'react-native'
import { styles } from '../../assets/styles/home.styles'

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Create</Text>
    </View>
  )
}