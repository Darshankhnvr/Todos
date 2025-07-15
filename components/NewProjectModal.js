import {Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";

const NewProjectModal =({visible, onClose, onSubmit}) =>{
    const [projectName, setProjectName] = useState("")


    const handleSubmit =()=>{
        if(projectName.trim()){
            onSubmit(projectName)
            setProjectName('')
        }
    }
    return(
    <Modal visible={visible} transparent={true} animationType={"fade"} >
    <View className={'flex-1 justify-center items-center bg-black/50'}>
        <View className={'bg-white w-4/5 rounded-lg p-6 items-center'}>
            <Text className={'text-xl font-bold mb-4'}>New Project</Text>
            <TextInput
            placeholder={"Enter your project name"}
            value={projectName}
            onChangeText={setProjectName}
            className="bg-gray-100 p-3 rounded-lg mb-4"
            />
            <View className={'flex-row p-4 gap-4 '}>
                <TouchableOpacity onPress={onClose} className="mr-4">
                    <Text className="text-red-500">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit}  className="text-blue-500 font-bold">
                   <Text className="text-blue-500 font-bold">Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    </Modal>
    )
}
export default NewProjectModal;