// screens/ProjectListScreen.js (DEFINITIVE BUG FIX VERSION)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { signOut } from 'firebase/auth';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { useRouter } from 'expo-router';
import NewProjectModal from '../components/NewProjectModal';
import ProjectListItem from '../components/ProjectListItem';

const ProjectListScreen = () => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(collection(db, 'projects'), where('users', 'array-contains', auth.currentUser.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const projectsData = [];

            // THIS IS THE FIX: We are being explicit about what data we use.
            querySnapshot.forEach((doc) => {
                const data = doc.data(); // Get the data object from the document
                projectsData.push({
                    id: doc.id,         // Get the document ID
                    name: data.name,      // Explicitly get the 'name' field from the data
                    // We could add other fields here if needed, like: users: data.users
                });
            });

            setProjects(projectsData);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);


    const handleLogout = async () => { await signOut(auth); };

    const handleCreateProject = async (projectName) => {
        setModalVisible(false);
        if (!auth.currentUser) return;
        try {
            const docRef = await addDoc(collection(db, 'projects'), {
                name: projectName,
                users: [auth.currentUser.uid],
                createdAt: new Date(),
            });
            router.push({
                pathname: '/(tabs)/[projectId]', // The "Expo Router Way" - use the file name
                params: { projectName: projectName, projectId: docRef.id } // Provide the values here
            });
        } catch (e) {
            Alert.alert("Error", "Could not create project.");
        }
    };

    return (
        <View className="flex-1 bg-gray-900 p-6 pt-16">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
                <Text className="text-white text-3xl font-bold">Your Projects</Text>
                <TouchableOpacity onPress={handleLogout}><Text className="text-red-500">Log Out</Text></TouchableOpacity>
            </View>

            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProjectListItem item={item} />}
                ListEmptyComponent={() => (
                    <Text className="text-gray-400 text-center mt-10">
                        You have no projects yet. Tap '+ New Project' to begin.
                    </Text>
                )}
            />

            <NewProjectModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleCreateProject} />
            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-blue-500 p-4 rounded-xl items-center absolute bottom-10 right-6"><Text className="text-white text-lg font-bold">+ New Project</Text></TouchableOpacity>
        </View>
    );
};

export default ProjectListScreen;