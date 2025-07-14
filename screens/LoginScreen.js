import {Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "@/firebase-config";
import {useRouter} from "expo-router";


const LoginScreen =() =>{
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const router = useRouter()
    const handleLogin = async () =>{
    if(email === "" || password === ""){
        Alert.alert("Email and Password must be filled to login")
        return;
    }
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        setPassword(" ")
        setEmail(" ")
        console.log("Logged in successfully", userCredentials.user)
        Alert.alert("Success", "You are logged in!")
    } catch (e) {
        console.log("Log in failure",e.message)
        Alert.alert("Login error", e.message)
    }
    }
    return(
        <View className={'bg-blue-400 w-full justify-center flex-1 p-6'}>
            <Text className={'text-white font-bold w-full text-2xl mb-2'}>Login to Your Account</Text>

            <TextInput
                className={"bg-gray-200 mb-4 p-4 pl-5 rounded-xl h-15"}
                placeholder={'Email'}
                value={email}
                onChangeText={setEmail}
                autoCapitalize={'none'}
            />
            <TextInput
                className={"bg-gray-200 mb-4 p-4 pl-5 rounded-xl h-17"}
                placeholder={"Password"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
            onPress={handleLogin}
            >
               <Text className={'text-white text-lg bg-green-400 p-4 rounded-xl text-center font-bold'}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> router.push('/signup')} className="mt-4">
                <Text className="text-center text-blue-500 font-semibold">
                    Don&#39;t have an account? Sign Up
                </Text>
            </TouchableOpacity>
        </View>
    )
}
export default LoginScreen;