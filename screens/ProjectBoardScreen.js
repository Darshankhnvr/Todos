// screens/ProjectBoardScreen.js (NEW VERSION)
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import CategoryColumn from "../components/CategoryColumn";


const ProjectBoardScreen = () => {
    const router = useRouter();
    // Get the projectId and projectName passed from the previous screen
    const { projectId, projectName } = useLocalSearchParams();

    // STATE MANAGEMENT
    // State for the project's categories (e.g., { id: 'frontend', name: 'Frontend', color: 'blue' })
    const [categories, setCategories] = useState([]);
    // State for all tasks in this project
    const [tasks, setTasks] = useState([]);

    // DATA FETCHING
    useEffect(() => {
        if (!projectId) return;

        // --- 1. Fetch Categories ---
        // Get a reference to the specific project document
        const projectDocRef = doc(db, 'projects', projectId);

        // getDoc fetches the document once. We don't need real-time updates for categories for now.
        getDoc(projectDocRef).then(docSnap => {
            if (docSnap.exists()) {
                // We will add a 'categories' field to our project documents
                // If it exists, set the state. If not, use a default.
                setCategories(docSnap.data().categories || [{ id: 'todo', name: 'To Do' }]);
            } else {
                Alert.alert("Error", "Project not found.");
            }
        });

        // --- 2. Fetch Tasks in Real-Time ---
        // Create a query to get all tasks where the 'projectId' field matches our current project
        const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));

        // Use onSnapshot for a real-time listener
        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setTasks(tasksData);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [projectId]);

    return (
        <View className="flex-1 bg-gray-900 pt-16">
            {/* Header */}
            <View className="flex-row items-center mb-8 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Text className="text-blue-500 text-lg">{'< Projects'}</Text>
                </TouchableOpacity>
                <Text className="text-white text-3xl font-bold">{projectName}</Text>
            </View>

            {/* Board - Horizontal ScrollView */}
            <ScrollView horizontal={true} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {categories.map(category => {
                    // Filter tasks to get only the ones for the current category
                    const categoryTasks = tasks.filter(task => task.category === category.id);
                    return (
                        <CategoryColumn
                            key={category.id}
                            category={category}
                            tasks={categoryTasks}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default ProjectBoardScreen;