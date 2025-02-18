import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, Modal, ActivityIndicator, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchData, checkForUpdates } from './dataHelper'; // Import the helper functions

const SettingsPage = ({ navigation }) => {
  const [localVersion, setLocalVersion] = useState(0); // Default to 0 if version.json is not present
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const updateVersions = async () => {
      const versions = await checkForUpdates();
      if (versions) {
        setLocalVersion(versions.localVersion);
        setRemoteVersion(versions.remoteVersion);
      }
    };

    updateVersions();
  }, []);

  const updateLocalData = async () => {
    setIsProcessing(true);

    try {
      const data = await fetchData();
      if (data) {
        Alert.alert('Success', 'Data updated successfully');
        
        // Update local version
        const versions = await checkForUpdates();
        if (versions) {
          setLocalVersion(versions.localVersion);
          setRemoteVersion(versions.remoteVersion);
        }

        // Navigate to ListPage after update
        navigation.navigate('List', { category: 'A' })
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update data: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
<View style={styles.container}>
 <View style={styles.buttonRow}>
  <Text >Local Version: {localVersion}</Text>
  <Text >Remote Version: {remoteVersion}</Text>
  </View>
</View>

    
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={updateLocalData}>
            <MaterialIcons name="cloud-download" size={50} color="white" />
            
          </TouchableOpacity>
        
          <TouchableOpacity  style={styles.button} onPress={() => navigation.navigate('Home')}>        
          
            <MaterialIcons name="home" size={50} color="white" />
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isProcessing}
            onRequestClose={() => {}}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.progressText}>Updating Data...</Text>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default SettingsPage;
