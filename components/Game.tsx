import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  findNodeHandle,
  UIManager,
  Alert,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useScore } from './ScoreProvider';
import Svg, { Line } from 'react-native-svg';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStack, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStack, 'Game'>;

interface Connection {
  imageId: string;
  labelId: string;
  line: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  };
}

const Game = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const route = useRoute<GameScreenRouteProp>();
  const { name, setName } = route.params;
  const { score, setScore } = useScore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  const dotRefs = useRef<{ [key: string]: any }>({});
  const labelDotRefs = useRef<{ [key: string]: any }>({});
  const containerRef = useRef<View>(null);
  const [containerOffset, setContainerOffset] = useState({ x: 0, y: 0 });

  const imageData = [
    { id: 'Apple', uri: 'https://ik.imagekit.io/zmuooch5m/Group.png' },
    { id: 'Ball', uri: 'https://ik.imagekit.io/zmuooch5m/Group%20(1).png' },
  ];

  const labelData = [
    { id: 'lbl1', label: 'Apple' },
    { id: 'lbl2', label: 'Ball' },
  ];

  const measureView = (ref: any, callback: (pos: { x: number; y: number }) => void) => {
    const node = findNodeHandle(ref);
    if (node) {
      UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
        callback({
          x: pageX - containerOffset.x + width / 2,
          y: pageY - containerOffset.y + height / 2,
        });
      });
    }
  };

  const onImageSelect = (id: string) => {
    const existingConnection = connections.find(conn => conn.imageId === id);
    if (existingConnection) {
      setConnections(prev => prev.filter(conn => conn.imageId !== id));
    }
    
    setSelectedImage(id);
  };

  const onLabelSelect = (labelId: string) => {
    if (!selectedImage) return;

    const existingConnection = connections.find(conn => conn.imageId === selectedImage);
    if (existingConnection) {
      setConnections(prev => prev.filter(conn => conn.imageId !== selectedImage));
    }

    const dotRef = dotRefs.current[selectedImage];
    const lblDotRef = labelDotRefs.current[labelId];

    if (dotRef && lblDotRef) {
      measureView(dotRef, (from) => {
        measureView(lblDotRef, (to) => {
          const newConnection: Connection = {
            imageId: selectedImage,
            labelId: labelId,
            line: { from, to }
          };
          setConnections(prev => [...prev, newConnection]);
        });
      });
    }

    setSelectedImage(null);
  };

 const handleSubmit = async () => {
  if (connections.length !== imageData.length) {
    console.log(`Please connect all items. Connected: ${connections.length}/${imageData.length}`);
    Alert.alert(
      'Incomplete Game', 
      `Please connect all items. You have connected ${connections.length} out of ${imageData.length} items.`,
      [{ text: 'OK' }]
    );
    return; 
  }

  const results = connections.map((conn) => {
    const labelText = labelData.find((lbl) => lbl.id === conn.labelId)?.label;
    const isMatch = conn.imageId === labelText;
    return {
      image: conn.imageId,
      label: conn.labelId,
      labelText,
      match: isMatch,
    };
  });

  // Calculate total score: +5 for each correct answer, 0 for incorrect
  const totalScore = results.reduce((score, result) => {
    return score + (result.match ? 5 : 0);
  }, 0);

  console.log('Connections:', results);
  console.log('Total Score:', totalScore);

  try {
    // Send data to Firestore
    const docRef = await addDoc(collection(db, 'gameResults'), {
      playerName: name,
      score: totalScore,
      results: results,
      totalQuestions: results.length,
      correctAnswers: results.filter(result => result.match).length,
      timestamp: new Date(),
      createdAt: new Date().toISOString(),
    });
    setScore(totalScore);
    navigation.navigate("GameSecond", {name, setName})
    console.log('Game result saved with ID: ', docRef.id);
  } catch (error) {
    console.error('Error saving game result: ', error);
  }
};

  const isImageConnected = (imageId: string) => {
    return connections.some(conn => conn.imageId === imageId);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FCEFBB", padding: 25 }}>
      <View style={{ alignSelf: 'flex-start' }}>
        <TouchableOpacity style={{ borderRadius: 20, backgroundColor: "#899EB6", padding: 5 }} onPress={()=> {navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });}}>
          <MaterialIcons name="home" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 35, fontFamily: "Nunito-SemiBold" }}>Can you spot what goes together?</Text>

        <View
          ref={containerRef}
          onLayout={() => {
            if (containerRef.current) {
              containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                setContainerOffset({ x: pageX, y: pageY });
              });
            }
          }}
          style={{
            flexDirection: "row",
            position: "relative",
            width: "90%",
            justifyContent: "center"
          }}
        >
          {/* SVG lines */}
          <Svg style={StyleSheet.absoluteFill}>
            {connections.map((connection, index) => (
              <Line
                key={index}
                x1={connection.line.from.x}
                y1={connection.line.from.y}
                x2={connection.line.to.x}
                y2={connection.line.to.y}
                stroke="black"
                strokeWidth="2"
              />
            ))}
          </Svg>

          {/* Left Column */}
          <View>
            {imageData.map((img) => (
              <TouchableOpacity
                key={img.id}
                onPress={() => onImageSelect(img.id)}
                style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}
              >
                <View>
                  <Image source={{ uri: img.uri }} style={{ width: 50, height: 55 }} />
                </View>
                <Text
                  ref={(ref) => {
                    dotRefs.current[img.id] = ref;
                  }}
                  style={{
                    fontSize: 50,
                    color: selectedImage === img.id ? 'green' : 
                           isImageConnected(img.id) ? 'blue' : 'black',
                  }}
                >
                  ·
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Right Column */}
          <View style={{ marginLeft: 100 }}>
            {labelData.map((lbl) => (
              <TouchableOpacity
                
                key={lbl.id}
                onPress={() => onLabelSelect(lbl.id)}
                style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}
              >
                
                <Text 
                  ref={(ref) => {
                    labelDotRefs.current[lbl.id] = ref;
                  }}
                  style={{ fontSize: 50 }}
                >
                
                  ·
                </Text>
                <View style={{backgroundColor: "#FFFFFF", padding: 10, borderRadius: 8, marginLeft: 10}}>
                <Text style={{ fontSize: 18, fontFamily: "Nunito-Bold"  }}>
                  {lbl.label}
                </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
          <TouchableOpacity style={{borderRadius: 20, backgroundColor: "#F0F0F0", padding: 5}}>
            <MaterialIcons name="volume-up" size={20} color="#4F6A94" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor : "#767CFF",
              marginRight: 40,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5
            }}
          >
            <MaterialIcons name="arrow-forward" size={25} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Game;