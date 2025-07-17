import {Text, TouchableOpacity, View} from "react-native";

const CategoryColumn =({category, tasks})=> {
    return(
        <View className="w-80 bg-gray-800 rounded-lg p-3 mr-4">
        <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">{category.name}</Text>
        </View>

            {tasks.map((task) => (
                <View key={task.id} className="bg-gray-700 p-3 rounded-md mb-3">
                    <Text className="text-white">{task.text}</Text>
                </View>
            ))}

            <TouchableOpacity className={'bg-gray-700 p-3 rounded-md mb-3'} >
                <Text className={'text-gray-400'}>+ Add a task</Text>
            </TouchableOpacity>
        </View>
    )

}
export default CategoryColumn