// app/index.js

import "../global.css";


import SignUpScreen from "@/screens/SignUpScreen";
import { Text, View } from "react-native";
import LoginScreen from "@/screens/LoginScreen";
import HomeScreen from "@/screens/HomeScreen";
import ProjectListScreen from "@/screens/ProjectListScreen";
export default function Index() {
  return (
    // We style the container with className now, not inline styles
    <View className="flex-1 justify-center items-center ">
      <Text className="text-3xl font-bold text-white p-4 text-center">
        NativeWind is Working!
      </Text>
      <Text className="text-lg text-gray-300 text-center">
        This screen is styled with NativeWind.
      </Text>
        {/*<SignUpScreen />*/}
        {/*<LoginScreen />*/}
        {/*<HomeScreen />*/}
        {/*<ProjectListScreen />*/}
    </View>
  );
}
