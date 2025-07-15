import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import {auth, db} from "@/firebase-config";
import {useRouter} from "expo-router";
import { addDoc, collection } from 'firebase/firestore';
import NewProjectModal from "@/components/NewProjectModal";

const ProjectListScreen = () => {
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false)

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleCreateProject = async (projectName) => {
       setModalVisible(false)
        if(!auth.currentUser){
            return Alert.alert("Error", "You must be logged in to create a project.");
        }
        try{
            const docRef = await addDoc(collection(db, 'projects'), {
                name: String(projectName),
                users: [auth.currentUser.uid],
                createdAt : new Date()
            })
            console.log("Document written with ID: ", docRef.id);
            // Navigate to the new project board, passing the ID and name
            router.push({
                pathname: `/(tabs)/${docRef.id}`,
                params: { projectName: projectName, projectId: docRef.id }
            });
        } catch (e){
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Could not create project.");
        }
    };



    return (
        <View className="flex-1 bg-gray-900 p-6 pt-16">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
                <Text className="text-white text-3xl font-bold">Your Projects</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text className="text-red-500">Log Out</Text>
                </TouchableOpacity>
            </View>

            {/* Project List Area - This will be empty for now */}
            <View className="flex-1">
                <Text className="text-gray-400 text-center">You have no projects yet.</Text>
            </View>

            <NewProjectModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleCreateProject}
            />

            {/* Create Project Button */}
            <TouchableOpacity
                onPress={handleCreateProject}
                className="bg-blue-500 p-4 rounded-xl items-center absolute bottom-10 right-6"
            >
                <Text className="text-white text-lg font-bold">+ New Project</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProjectListScreen;