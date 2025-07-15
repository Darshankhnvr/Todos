import {Text, TouchableOpacity, View} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";

const ProjectBoardScreen=()=>{
    const {projectName, projectId} = useLocalSearchParams()
    const router = useRouter()
    return(
        <View>
            <View>
                <TouchableOpacity onPress={()=> router.back()}>
                    <Text>{'< Projects'}</Text>
                </TouchableOpacity>
                <Text>{projectName}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-gray-400 text-center">
                    Project Board for {projectId} will go here!
                </Text>
            </View>
        </View>
    )
}
export default ProjectBoardScreen;