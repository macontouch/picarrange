import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  Modal,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomAlert from './dataHelper';

const UpdatePage = ({ navigation, route }) => {
  const { item } = route.params || {}; // Get the item from route params if available
  const [name, setName] = useState(item ? item.name : '');
  const [description, setDescription] = useState(item ? item.description : '');
  const [category, setCategory] = useState(item ? item.category : '');
  const [categories, setCategories] = useState([]); // State for categories
  const [imageBase64, setImageBase64] = useState(
    item ? item.image.split(',')[1] : ''
  );
  const [thumbnailBase64, setThumbnailBase64] = useState(
    item ? item.t_image.split(',')[1] : ''
  );
  const [loading, setLoading] = useState(false);
  const [newImageSelected, setNewImageSelected] = useState(false); // State to track if a new image is selected

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showCustomAlert(
          'Permissions needed',
          'We need camera roll permissions to select images.',
          () => {
            setAlertVisible(false);
          }
        );
      }
    };

    const loadCategories = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('categories');
        const storedCategories = jsonValue != null ? JSON.parse(jsonValue) : [];
        const categoryOptions = storedCategories.map((cat) => ({
          label: cat.category,
          value: cat.denotedby,
        }));
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    requestPermissions();
    loadCategories();
  }, []);

  const checkForDuplicateName = async (newName, originalName = null) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'data.json';
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const existingData = fileContent ? JSON.parse(fileContent) : [];

      // Check for duplicate name
      const duplicateItem = existingData.find((item) => item.name === newName);

      if (duplicateItem && newName !== originalName) {
        throw new Error('An item with this name already exists.');
      }

      return true; // Valid name
    } catch (error) {
      return false; // Invalid name
    }
  };

  const pickImage = async () => {
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
      showCustomAlert(
        'Error',
        'An error occurred while picking the image.',
        () => {
          setAlertVisible(false);
        }
      );
    }
  };

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
      showCustomAlert(
        'Error',
        'An error occurred while picking the image.',
        () => {
          setAlertVisible(false);
        }
      );
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
      showCustomAlert(
        'Error',
        'An error occurred while capturing the photo.',
        () => {
          setAlertVisible(false);
        }
      );
    }
  };

  const showCustomAlert = (title, message, onConfirm) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setOnConfirmAction(() => onConfirm);
    setAlertVisible(true);
  };

  const updateData = async () => {
    try {
      const isValidName = await checkForDuplicateName(name, item.name);

      if (!isValidName) return;

      const fileUri = FileSystem.documentDirectory + 'data.json';

      let updatedEntry = {
        name,
        description,
        image: `data:image/png;base64,${imageBase64}`,
        t_image: `data:image/png;base64,${thumbnailBase64}`,
        category,
        liked: item ? item.liked : 0, // Preserve the existing likes if editing
      };

      // Include image and thumbnail only if a new image was selected
      if (newImageSelected) {
        updatedEntry.image = `data:image/png;base64,${imageBase64}`;
        updatedEntry.t_image = `data:image/png;base64,${thumbnailBase64}`;
      } else {
        updatedEntry.image = item.image;
        updatedEntry.t_image = item.t_image;
      }

      let existingData = [];
      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          existingData = fileContent ? JSON.parse(fileContent) : [];
        }
      } catch (error) {
        console.error('Error reading file:', error);
      }

      existingData = existingData.map((song) =>
        song.name === item.name && song.description === item.description
          ? updatedEntry
          : song
      ); // Update existing entry

      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(existingData)
      );
      showCustomAlert('Updated', 'Item updated successfully.', () => {
        navigation.navigate('Home');
        setAlertVisible(false);
      });
    } catch (error) {
      showCustomAlert(
        'Error',
        'An error occurred while saving the data.',
        () => {
          setAlertVisible(false);
        }
      );
    }
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}>
      <View style={styles.container}>
        <RNPickerSelect
          placeholder={{}}
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
            style={[
              styles.iconButton,
              (!imageBase64 ||
                !thumbnailBase64 ||
                !name ||
                !description ||
                !category) &&
                styles.disabledButton,
            ]}
            onPress={updateData}
            disabled={
              !imageBase64 ||
              !thumbnailBase64 ||
              !name ||
              !description ||
              !category
            }>
            <MaterialIcons name="save" size={24} color="white" />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={
            newImageSelected
              ? { uri: `data:image/png;base64,${imageBase64}` }
              : { uri: item.image }
          }
          style={styles.image}
          onError={() => console.error('Error loading image.')}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('List')}>
            <MaterialIcons name="list" size={24} color="white" />
            <Text style={styles.buttonText}>Go to List Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Home')}>
            <MaterialIcons name="home" size={24} color="white" />
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Modal */}
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => setLoading(false)}>
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
  space: {
    height: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
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

export default UpdatePage;
