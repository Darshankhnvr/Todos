import {Alert, Text, TouchableOpacity, View} from "react-native";
import { signOut } from 'firebase/auth';
import {auth} from "@/firebase-config";
import ProjectListScreen from "@/screens/ProjectListScreen";
const HomeScreen =() =>{

    const handleLogout = async () =>{

        try {
            await signOut(auth);
            Alert.alert("Signed out successfully")
        } catch (e){
            Alert.alert("Failed to signOut", e.message)
            console.log("Failed to signOut", e.message)
        }

    }
    return(
        <View className="flex-1 justify-center items-center bg-gray-900 w-full">
            <Text className="text-white text-3xl font-bold mb-8">Welcome to Todos</Text>
            <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 p-4 rounded-xl items-center"
            >
                <Text className="text-white text-lg font-bold">Log Out</Text>
            </TouchableOpacity>
            <ProjectListScreen />
        </View>

    )
}
export default HomeScreen;