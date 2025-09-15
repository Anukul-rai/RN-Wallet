import { StatusBar, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar barStyle={'dark-content'}/>
      <Text>New Projects</Text>
    </View>
  );
}
