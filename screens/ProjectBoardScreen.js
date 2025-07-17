import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot, collection, query, where, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import CategoryColumn from '../components/CategoryColumn';
import NewTaskModal from '../components/NewTaskModal';
import PromptModal from '../components/PromptModal';

const ProjectBoardScreen = () => {
    const router = useRouter();
    const { projectId, projectName } = useLocalSearchParams();

    const [categories, setCategories] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    useEffect(() => {
        if (!projectId) return;

        const projectDocRef = doc(db, 'projects', projectId);
        const unsubscribeProject = onSnapshot(projectDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setCategories(docSnap.data().categories || [{ id: 'todo', name: 'To Do' }]);
            } else {
                Alert.alert("Error", "Project not found.");
                router.back();
            }
        });

        const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));
        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setTasks(tasksData);
        });

        return () => {
            unsubscribeProject();
            unsubscribeTasks();
        };
    }, [projectId]);

    const handleOpenTaskModal = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setTaskModalVisible(true);
    };

    const handleAddTask = async (taskText, categoryId) => {
        setTaskModalVisible(false);
        if (!auth.currentUser || !projectId) return;
        try {
            await addDoc(collection(db, 'tasks'), { text: taskText, projectId, category: categoryId, createdAt: new Date(), authorId: auth.currentUser.uid });
        } catch (error) {
            Alert.alert("Error", "Could not add task.");
        }
    };

    const handleAddNewCategory = () => {
        setCategoryModalVisible(true);
    };

    const handleCategorySubmit = async (categoryName) => {
        setCategoryModalVisible(false);
        if (categoryName && categoryName.trim()) {
            const projectDocRef = doc(db, 'projects', projectId);
            const newCategoryId = categoryName.toLowerCase().replace(/\s+/g, '');
            try {
                await updateDoc(projectDocRef, {
                    categories: arrayUnion({ id: newCategoryId, name: categoryName })
                });
            } catch (error) {
                Alert.alert("Error", "Could not add the new column.");
            }
        }
    };

    return (
        <View className="flex-1 bg-gray-900 pt-16">
            <View className="flex-row items-center mb-8 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mr-4"><Text className="text-blue-500 text-lg">{'< Projects'}</Text></TouchableOpacity>
                <Text className="text-white text-3xl font-bold">{projectName}</Text>
            </View>

            <ScrollView horizontal={true} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {categories.map(category => (
                    <CategoryColumn key={category.id} category={category} tasks={tasks.filter(task => task.category === category.id)} onAddTask={handleOpenTaskModal} />
                ))}
                <TouchableOpacity onPress={handleAddNewCategory} className="w-80 bg-gray-800/50 rounded-lg p-3 justify-center items-center">
                    <Text className="text-white font-bold text-lg">+ Add another column</Text>
                </TouchableOpacity>
            </ScrollView>

            <NewTaskModal visible={taskModalVisible} categoryId={selectedCategoryId} onClose={() => setTaskModalVisible(false)} onSubmit={handleAddTask} />
            <PromptModal visible={categoryModalVisible} title="New Column" placeholder="Enter column name..." onClose={() => setCategoryModalVisible(false)} onSubmit={handleCategorySubmit} />
        </View>
    );
};

export default ProjectBoardScreen;