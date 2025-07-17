import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

const PromptModal = ({ visible, title, placeholder, onSubmit, onClose }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSubmit(inputValue);
            setInputValue('');
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-4/5 rounded-lg p-6">
                    <Text className="text-xl font-bold mb-4">{title}</Text>
                    <TextInput
                        placeholder={placeholder}
                        value={inputValue}
                        onChangeText={setInputValue}
                        className="bg-gray-100 p-3 rounded-lg mb-4"
                        autoFocus={true}
                    />
                    <View className="flex-row justify-end">
                        <TouchableOpacity onPress={onClose} className="mr-4">
                            <Text className="text-gray-500">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit}>
                            <Text className="text-blue-500 font-bold">Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PromptModal;