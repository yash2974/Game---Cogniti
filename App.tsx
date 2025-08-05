/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Game from './components/Game';
import GameSecond from './components/GameSecond';
import { ScoreProvider } from './components/ScoreProvider';
import Score from './components/Score';

export type RootStack = {
  Home: undefined;
  Game: {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
  };
  GameSecond: {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
  };
  Score: undefined
}

const Stack = createNativeStackNavigator<RootStack>();
function App() {

  return (
    <ScoreProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" 
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Game"
          component={Game}
          options={{headerShown: false}}
        />
        <Stack.Screen name="GameSecond"
          component={GameSecond}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Score"
          component={Score}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ScoreProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
