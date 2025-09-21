import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001/api"     // Android Emulator
    : "http://192.168.18.3:5001/api"; // iOS simulator or physical device