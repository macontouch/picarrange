import React from 'react';
import { View, StyleSheet, BackHandler, ImageBackground, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HomePage = ({ navigation }) => {
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
            <Text style={styles.buttonText}>Upload Song</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('List', { category: 'A' })}>
            <MaterialIcons name="list" size={50} color="white" />
            <Text style={styles.buttonText}>All Songs</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('List', { category: 'B' })}>
            <MaterialIcons name="music-note" size={50} color="white" />
            <Text style={styles.buttonText}>Bengali{'\n'}Songs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('List', { category: 'H' })}>
            <MaterialIcons name="music-note" size={50} color="white" />
            <Text style={styles.buttonText}>Hindi{'\n'}Songs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('List', { category: 'E' })}>
            <MaterialIcons name="music-note" size={50} color="white" />
            <Text style={styles.buttonText}>English{'\n'}Songs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('List', { category: 'O' })}>
            <MaterialIcons name="music-note" size={50} color="white" />
            <Text style={styles.buttonText}>Other{'\n'}Songs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons name="settings" size={50} color="white" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={exitApp}>
            <MaterialIcons name="exit-to-app" size={50} color="white" />
            <Text style={styles.buttonText}>Exit</Text>
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
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#505050',
    borderRadius: 5,
    flex: 1,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomePage;
