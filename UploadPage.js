import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, Modal, Alert, TouchableOpacity, ImageBackground,Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';

const UploadPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('B');
  const [imageBase64, setImageBase64] = useState('');
  const [thumbnailBase64, setThumbnailBase64] = useState('');
  const [loading, setLoading] = useState(false); // State for loading

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
    };

    requestPermissions();
  }, []);

  const pickImage = async () => {
    try {
      setLoading(true); // Show loading

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      console.log('Image Picker Result:', result);

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          const uri = result.assets[0].uri;

          console.log('Image URI:', uri);

          setImageBase64(result.assets[0].base64);

          const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 50, height: 50 } }],
            { base64: true }
          );

          console.log('Manipulated Image Base64:', manipResult.base64);
          setThumbnailBase64(manipResult.base64);
        } else {
          console.error('Image URI is undefined.');
        }
      }

      setLoading(false); // Hide loading
    } catch (error) {
      setLoading(false); // Hide loading in case of error
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

   const checkForDuplicateName = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'data.json';
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const existingData = fileContent ? JSON.parse(fileContent) : [];

      
      Alert.alert('info', existingData.some(item => item.name === name) );
      return existingData.some(item => item.name === name);
    } catch (error) {
        console.error('Error reading file:', error);
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
      setCategory('B');
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




  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <RNPickerSelect
          placeholder={{ label: 'Select a category', value: null, color: '#9EA0A4' }}
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: 'Bengali', value: 'B' },
            { label: 'Hindi', value: 'H' },
            { label: 'English', value: 'E' },
            { label: 'Others', value: 'O' },
          ]}
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
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <MaterialIcons name="add-photo-alternate" size={24} color="white" />
            <Text style={styles.buttonText}>Pick an Image</Text>
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

export default UploadPage;