import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, Modal, ActivityIndicator} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchData, checkForUpdates } from './dataHelper'; // Import the helper functions
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './dataHelper';

const SettingsPage = ({ navigation }) => {
  const [localVersion, setLocalVersion] = useState(0); // Default to 0 if version.json is not present
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  

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

  const showCustomAlert = (title, message, onConfirm) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setOnConfirmAction(() => onConfirm);
    setAlertVisible(true);
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('user');
      showCustomAlert(
        'Success',
        'User data has been cleared.',
        () => {
          setAlertVisible(false);
        }
      );



    } catch (error) {
      showCustomAlert(
        'Error',
        'Failed to clear user data.',
        () => {
          setAlertVisible(false);
        }
      );
    }
  };

  const updateLocalData = async () => {
    setIsProcessing(true);

    try {
      const data = await fetchData();
      if (data) {
        showCustomAlert(
        'Success',
        'Data updated successfully.',
        () => {
          setAlertVisible(false);
        }
      );
        
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
     showCustomAlert(
        'Error',
        `Failed to update data: ${error.message}`,
        () => {
          setAlertVisible(false);
        }
      );
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
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserAuth')}>
              <MaterialIcons name="account-circle" size={50} color="white" />
              <Text style={styles.buttonText}> User </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={clearUserData}>
              <MaterialIcons name="person-remove" size={50} color="white" />
              <Text style={styles.buttonText}> User </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity  style={styles.button} onPress={() => navigation.navigate('Home')}>        
            <MaterialIcons name="home" size={50} color="white" />
            <Text style={styles.buttonText}> Home </Text>
          </TouchableOpacity>

          <TouchableOpacity  style={styles.button} onPress={() => navigation.navigate('AdmobPage')}>        
            <MaterialIcons name="photo" size={50} color="white" />
            <Text style={styles.buttonText}> Admob </Text>
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

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={onConfirmAction}
        onCancel={() => setAlertVisible(false)}
        showCancelButton={false}
      />

      
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
