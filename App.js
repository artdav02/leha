import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { Mulish_400Regular, Mulish_500Medium, Mulish_600SemiBold, Mulish_700Bold, Mulish_900Black } from '@expo-google-fonts/mulish';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeHeader = () => {
  return (
      <View style={styles.navbar}>
        <Text style={styles.header}>Fix me</Text>
      </View>
  );
};

const ItemHeader = ({ itemName }) => {
  return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Fix me</Text>
        <Text style={styles.itemName}>{itemName}</Text>
      </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleListItemPress = (item) => {
    setSelectedItem(item);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  let [fontsLoaded] = useFonts({
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_900Black,
  });

  if (!fontsLoaded) {
    return null; // Or a loading indicator if desired
  }

  const listItems = [
    { id: 1, name: 'Left engine', importanceLevel: 1 },
    { id: 2, name: 'Right engine', importanceLevel: 2 },
    { id: 3, name: 'Bashmack', importanceLevel: 3 },
    { id: 4, name: 'XUI', importanceLevel: 1 },
    // Add more items as needed
  ];

  const maxImportanceLevel = 3;

  return (
      <View>
        <HomeHeader />
        <ScrollView contentContainerStyle={styles.container}>
          {listItems.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleListItemPress(item)} style={styles.listItem}>
                <View style={styles.importance}>
                  <View>
                    <Text style={styles.listText}>{item.name}</Text>
                  </View>
                  <View>
                    <Text style={styles.importanceText}>Importance</Text>
                    <View style={styles.preDashes}>
                      {[...Array(maxImportanceLevel)].map((_, i) => (
                          <View
                              key={i}
                              style={[
                                styles.dashes,
                                i < item.importanceLevel ? styles[`dashes${item.importanceLevel}`] : styles.simpleDashes,
                              ]}
                          ></View>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
          ))}
          {/* Rest of the list items */}

          <Modal visible={isPopupVisible} animationType="fade" transparent={true} onRequestClose={closePopup}>
            <View style={styles.modalContainer}>
              <View style={styles.popup}>
                <Text style={styles.popupText}>Would you like to fix {selectedItem?.name}?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                      onPress={() => {
                        setPopupVisible(false);
                        navigation.navigate('Item', { item: selectedItem });
                      }}
                      style={styles.beginButton}
                  >
                    <Text style={styles.beginButtonText}>Begin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
  );
};

const ItemScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [seconds, setSeconds] = useState(0);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (!finishModalVisible) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [finishModalVisible]);

  const proceed = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
    setLoading(false);
    navigation.navigate('Home');
  };

  return (
      <View>
        <HomeHeader />
        <ScrollView contentContainerStyle={styles.container}>
          <ItemHeader itemName={item.name} />
          <View style={styles.content}>
            <Text>This is the content of the {item.name} item.</Text>
            <Text>Time elapsed: {seconds} seconds</Text>
            <TouchableOpacity
                style={styles.finishButton}
                onPress={() => setFinishModalVisible(true)}
            >
              <Text style={styles.finishButtonText}>FINISH</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal visible={finishModalVisible} animationType="fade" transparent={true} onRequestClose={() => setFinishModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupText}>Are you sure you want to finish?</Text>
              <Text style={styles.popupText}>Time spent: {seconds} seconds</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={proceed}
                    style={styles.proceedButton}
                >
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.proceedButtonText}>Proceed</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFinishModalVisible(false)} style={styles.backButton}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
};


const Stack = createStackNavigator();

const App = () => {

  const [userChoice, setUserChoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChoice = async () => {
      await AsyncStorage.clear(); // udoli
      const choice = await AsyncStorage.getItem('userChoice');
      setUserChoice(choice);
      setLoading(false);
      // backeck
    };

    fetchChoice();
  }, []);

  const saveChoice = async (choice) => {
    await AsyncStorage.setItem('userChoice', choice);
    setUserChoice(choice);
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (userChoice === null) {
    return (
        <View style={styles.all}>
          <Text>Select an option:</Text>
          <TouchableOpacity onPress={() => saveChoice('1')}>
            <Text style={styles.optionsFirst}>Metal</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveChoice('2')}>
            <Text style={styles.optionsFirst}>Wood</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveChoice('3')}>
            <Text style={styles.optionsFirst}>Plastic</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false, // Hide the header
              }}
          />
          <Stack.Screen name="Item" component={ItemScreen} options={{
            headerShown: false, // Hide the header
          }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  all:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  navbar: {
    width: '100%',
    height: 80,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
  },
  optionsFirst : {
    fontSize: 20,
    textTransform: 'uppercase',
    color: 'black',
    fontFamily: 'Mulish_900Black',
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    width: 300,
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    textTransform: 'uppercase',
    color: 'white',
    fontFamily: 'Mulish_900Black',
  },
  headerText: {
    fontSize: 20,
    textTransform: 'uppercase',
    color: 'white',
    fontFamily: 'Mulish_900Black',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    height: '100%',
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  importance: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  listItem: {
    width: '90%',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7FC',
    padding: 20,
    borderWidth: 2,
    borderColor: 'black',
    margin: 10,
    borderRadius: 10,
  },
  importanceText: {
    fontFamily: 'Mulish_700Bold',
    fontSize: 14,
  },
  preDashes: {
    marginTop: 5,
    justifyContent: 'space-between',
    gap: 2,
    flexDirection: 'row',
  },
  dashes: {
    width: 20,
    height: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  dashes1: {
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
  },
  dashes2: {
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
  },
  dashes3: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
  simpleDashes: {
    backgroundColor: 'white',
  },
  listText: {
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Grey overlay
  },
  popupText: {
    fontSize: 22,
    fontFamily: 'Mulish_900Black',
    padding: 5,
  },
  popup: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
    color: 'red',
  },
  closeButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 2,
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
  },
  beginButtonText: {
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
    color: 'white',
  },
  beginButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    borderColor: 'green',
    borderWidth: 2,
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
  },
  buttonContainer: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  finishButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
  },
  proceedButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    borderColor: 'lightgreen',
    borderWidth: 2,
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
  },
  proceedButtonText: {
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
    color: 'white',
  },
  backButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 2,
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
  },
  backButtonText: {
    fontSize: 18,
    fontFamily: 'Mulish_700Bold',
    color: 'red',
  },
});

export default App;
