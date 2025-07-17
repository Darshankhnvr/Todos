import {Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";

const ProjectListItem =({item})=>{
    const router = useRouter()

    const handlePress =() =>{
        router.push({
            pathname: `/(tabs)/${item.id}`,
            params: {projectName: item.name, projectId:item.id}
        })
    }
    return(
        <TouchableOpacity
        onPress={handlePress}
        className={'bg-gray-800 p-4 rounded-lg mb-4'}
        >
        <Text className="text-white text-lg font-bold">{item.name}</Text>
        </TouchableOpacity>
    )
}
export default ProjectListItem;