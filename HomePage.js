import React, { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, ImageBackground, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const HomePage = ({ navigation }) => {
  const [pinnedCategories, setPinnedCategories] = useState([]);

  useEffect(() => {
    const loadPinnedCategories = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('categories');
        const storedCategories = jsonValue != null ? JSON.parse(jsonValue) : [];
        const pinned = storedCategories.filter(cat => cat.pintohome === true);
        setPinnedCategories(pinned);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadPinnedCategories();
  }, []);

  const exitApp = () => {
    BackHandler.exitApp();
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Upload')}>
            <MaterialIcons name="cloud-upload" size={50} color="white" />
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('List', { category: '0' })}>
            <MaterialIcons name="list" size={50} color="white" />
            <Text style={styles.buttonText}>All List</Text>
          </TouchableOpacity>
        </View>
        {pinnedCategories.map((category, index) => {
          if (index % 2 === 0) {
            return (
              <View style={styles.buttonRow} key={index}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('List', { category: category.denotedby })}
                >
                  <MaterialIcons name="list" size={50} color="white" />
                  <Text style={styles.buttonText}>{category.category}</Text>
                </TouchableOpacity>
                {index + 1 < pinnedCategories.length && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('List', { category: pinnedCategories[index + 1].denotedby })}
                  >
                    <MaterialIcons name="list" size={50} color="white" />
                    <Text style={styles.buttonText}>{pinnedCategories[index + 1].category}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }
          return null;
        })}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Category')}>
            <MaterialIcons name="category" size={50} color="white" />
            <Text style={styles.buttonText}>Category</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings', { })} //onPress={exitApp}   exit-to-app
          >
            <MaterialIcons name="settings" size={50} color="white" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#505050',
    borderRadius: 5,
    width: 120, // Smaller width to make it square
    height: 120, // Smaller height to make it square
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12, // Adjust font size if needed
    textAlign: 'center', // Center the text
  },
});

export default HomePage;
