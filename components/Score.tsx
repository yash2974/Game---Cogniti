import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useScore } from './ScoreProvider';
import { useNavigation } from '@react-navigation/native';
import { RootStack } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
const Score = () => {
  const { score } = useScore();
    const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Final Score</Text>
      <Text style={styles.score}>{score}</Text>
      <TouchableOpacity
  style={{ padding: 10, backgroundColor: "#F94848" }}
  onPress={() =>
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  }
>
        <Text>Play Again</Text>
    </TouchableOpacity>
    </View>
    
  );
};

export default Score;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  score: {
    fontSize: 48,
    color: 'green',
    marginTop: 20
  }
});
