import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStack } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStack, 'Home'>;

const Home = () => {
    const [name, setName] = useState("");
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleStartGame = () => {
        if (name.trim() === "") {
            Alert.alert("Name Required", "Please enter your name to continue");
            return;
        }
        navigation.navigate("Game", { name: name.trim(), setName });
    };

    const isNameEmpty = name.trim() === "";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Your Name</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your name here"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#999"
                            maxLength={30}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>
                </View>
                <TouchableOpacity 
                    style={[
                        styles.startButton, 
                        isNameEmpty && styles.startButtonDisabled
                    ]} 
                    onPress={handleStartGame}
                    disabled={isNameEmpty}
                    activeOpacity={isNameEmpty ? 1 : 0.8}
                >
                    <Text style={[
                        styles.startButtonText,
                        isNameEmpty && styles.startButtonTextDisabled
                    ]}>
                        Start Game
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCEFBB",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        fontFamily: "Nunito-SemiBold" 
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 32,
    },
    label: {
        fontSize: 18,
        color: '#333',
        marginBottom: 12,
        fontFamily: "Nunito-Bold" 
    },
    inputWrapper: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textInput: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#333',
        borderRadius: 12,
    },
    startButton: {
        backgroundColor: "#F94848",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#F94848',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    startButtonDisabled: {
        backgroundColor: "#CCC",
        shadowColor: '#CCC',
        shadowOpacity: 0.1,
    },
    startButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: 'bold',
    },
    startButtonTextDisabled: {
        color: "#999",
    },
});

export default Home