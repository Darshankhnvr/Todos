import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert, FlatList} from 'react-native';
import { signOut } from 'firebase/auth';
import {auth, db} from "@/firebase-config";
import {useRouter} from "expo-router";
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import NewProjectModal from "@/components/NewProjectModal";
import ProjectListItem from "@/components/ProjectListItem";

const ProjectListScreen = () => {
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false)
    const [projects, setProjects] = useState([])


// In the useEffect where you handle the query
    useEffect(() => {
        if (!auth.currentUser) return;

        try {
            const q = query(collection(db, 'projects'), where('users', 'array-contains', auth.currentUser.uid));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const projectsData = [];
                // Make sure to check if querySnapshot exists
                if (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        if (doc.exists()) {
                            projectsData.push({
                                ...doc.data(),
                                id: doc.id
                            });
                        }
                    });
                }
                setProjects(projectsData);
            }, (error) => {
                console.error("Error fetching projects:", error);
                Alert.alert("Error", "Failed to fetch projects");
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Error setting up listener:", error);
            Alert.alert("Error", "Failed to set up projects listener");
        }
    }, [auth.currentUser]);

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

            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProjectListItem item={item} />}
                // This will be shown if the list is empty
                ListEmptyComponent={() => (
                    <Text className="text-gray-400 text-center mt-10">
                        You have no projects yet. Tap '+ New Project' to begin.
                    </Text>
                )}
            />

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