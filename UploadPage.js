import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, Modal, Alert, TouchableOpacity, ImageBackground, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './dataHelper';


const UploadPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); // State for categories
  const [imageBase64, setImageBase64] = useState('');
  const [thumbnailBase64, setThumbnailBase64] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const [newImageSelected, setNewImageSelected] = useState(false); // State to track if a new image is selected
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissions needed',
          'We need camera roll permissions to select images',
          [{ text: 'OK' }]
        );
      }
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert(
          'Permissions needed',
          'We need camera permissions to capture images',
          [{ text: 'OK' }]
        );
      }
    };

    const loadCategories = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('categories');
        const storedCategories = jsonValue != null ? JSON.parse(jsonValue) : [];
        const categoryOptions = storedCategories.map(cat => ({ label: cat.category, value: cat.category }));
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    requestPermissions();
    loadCategories();
  }, []);

  const pickImageFromLibrary = async () => {
    try {
      setLoading(true); // Show loading

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          const uri = result.assets[0].uri;
          setImageBase64(result.assets[0].base64);

          const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 50, height: 50 } }],
            { base64: true }
          );
          setThumbnailBase64(manipResult.base64);
          setNewImageSelected(true); // Set the flag to true if a new image is selected
        }
      }

      setLoading(false); // Hide loading
    } catch (error) {
      setLoading(false); // Hide loading in case of error
      showCustomAlert('Error', `An error occurred while picking the image: ${error.message}`, () => {
        setAlertVisible(false);
      });
    }
  };

  const captureImageWithCamera = async () => {
    try {
      setLoading(true); // Show loading

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          const uri = result.assets[0].uri;
          setImageBase64(result.assets[0].base64);

          const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 50, height: 50 } }],
            { base64: true }
          );
          setThumbnailBase64(manipResult.base64);
          setNewImageSelected(true); // Set the flag to true if a new image is selected
        }
      }

      setLoading(false); // Hide loading
    } catch (error) {
      setLoading(false); // Hide loading in case of error
      showCustomAlert('Error', `An error occurred while capturing the photo: ${error.message}`, () => {
        setAlertVisible(false);
      });
    }
  };

  const saveData = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'data.json';
      let existingData = [];

      try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        existingData = fileContent ? JSON.parse(fileContent) : [];
      } catch (error) {
        // If the file does not exist, we'll create it later
        console.log('File not found, will create a new one.');
      }

      if (!existingData.some(item => item.name === name)) {
        const newEntry = {
          name,
          description,
          image: `data:image/png;base64,${imageBase64}`,
          t_image: `data:image/png;base64,${thumbnailBase64}`,
          category,
          liked: 0
        };

        existingData.push(newEntry);

        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existingData, null, 2));

        Alert.alert('Success', 'Data saved successfully.');
        setName('');
        setDescription('');
        setCategory('');
        setImageBase64('');
        setThumbnailBase64('');

        navigation.navigate('List');
      } else {
        Alert.alert('Error', 'Same name is already used for another item.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'An error occurred while saving the data.' + error);
    }
  };

  const showCustomAlert = (title, message, onConfirm) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setOnConfirmAction(() => onConfirm);
    setAlertVisible(true);
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <RNPickerSelect
          placeholder={{ label: 'Select a category', value: null, color: '#9EA0A4' }}
          onValueChange={(value) => setCategory(value)}
          items={categories}
          style={pickerSelectStyles}
          value={category}
        />
        <TextInput 
          placeholder="Name" 
          value={name} 
          onChangeText={setName} 
          style={[styles.input, { backgroundColor: 'white' }]} 
        />
        <TextInput 
          placeholder="Description" 
          value={description} 
          onChangeText={setDescription} 
          style={[styles.input, { backgroundColor: 'white' }]} 
        />
        <View style={styles.buttonRow}>
           <TouchableOpacity
            style={styles.iconButton}
            onPress={pickImageFromLibrary}>
            <MaterialIcons name="add-photo-alternate" size={24} color="white" />
            <Text style={styles.buttonText}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={captureImageWithCamera}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, (!imageBase64 || !thumbnailBase64 || !name || !description || !category) && styles.disabledButton]}
            onPress={saveData}
            disabled={!imageBase64 || !thumbnailBase64 || !name || !description || !category}
          >
            <MaterialIcons name="save" size={24} color="white" />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {imageBase64 ? (
          <Image
            source={{ uri: `data:image/png;base64,${imageBase64}` }}
            style={styles.image}
          />
        ) : null}
         
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('List')}>
            <MaterialIcons name="list" size={24} color="white" />
            <Text style={styles.buttonText}>Go to List Page</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
            <MaterialIcons name="home" size={24} color="white" />
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Modal */}
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => setLoading(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Processing...</Text>
            </View>
          </View>
        </Modal>
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
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#505050',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    alignItems: 'center',
      width: 350, // Make the image as wide as the screen
      height: 350,
      resizeMode: 'contain',
      marginBottom: 20,
    },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: 'white',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

export default UploadPage;