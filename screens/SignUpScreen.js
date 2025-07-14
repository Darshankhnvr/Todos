import {Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from "@/firebase-config";


const SignUpScreen =() =>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignUp = async() =>{
        if(email === '' || password === ''){
            Alert.alert("Email and Password must be filled")
            return ;
        }

        try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log("User account created", userCredential.user)
            setEmail(" ")
            setPassword(" ")
            Alert.alert("Success", "Your account has been created!")

        } catch (e){
            console.log(e)
            Alert.alert("SignUp Error", e.message)
        }
    }
    return(
        <View className={'bg-blue-400 justify-center flex-1 p-6 w-full'}>
            <Text className={'text-2xl font-bold text-white mb-2'}>
                Create an account
            </Text>

            <TextInput
                className={'bg-gray-300 text-lg rounded-xl mb-4 p-4 pl-5'}
                placeholder={'Email'}
                value={email}
                onChangeText={setEmail}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
            />

            <TextInput
                className={'bg-gray-300 text-lg rounded-xl mb-4 p-4 pl-5'}
                placeholder={'Password'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
            className={'bg-green-500 p-4 rounded-xl items-center'}
            onPress={handleSignUp}
            >
                <Text className={'text-white text-center text-lg font-bold'}>SignUp</Text>
            </TouchableOpacity>
        </View>
    )
}
export default SignUpScreen;