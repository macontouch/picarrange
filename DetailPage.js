import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert,ImageBackground } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import CustomAlert from './dataHelper';

const DetailPage = ({ route, navigation }) => {
  const { item } = route.params;
  const [likes, setLikes] = useState(item.liked);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [showCancelButton, setShowCancelButton] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      const fileUri = FileSystem.documentDirectory + 'data.json';
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const existingData = fileContent ? JSON.parse(fileContent) : [];
      const updatedItem = existingData.find(song => song.name === item.name);
      setLikes(updatedItem ? updatedItem.liked : 0);
    };
    fetchData();
  }, []);

  const showCustomAlert = (title, message, onConfirm) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setOnConfirmAction(() => onConfirm);
    setShowCancelButton(false);
    setAlertVisible(true);
  };

  const shareImage = async () => {
    try {
      const base64Data = item.image.split(',')[1]; // Extract base64 data
      const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;

      // Write the base64 data to a file
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        showCustomAlert('Error', 'Sharing is not available on this device', () => {
              setAlertVisible(false);
            });
      }
    } catch (error) {
      showCustomAlert('Error', 'An error occurred while sharing the image: ${error.message}', () => {
              setAlertVisible(false);
            });
    }
  };

  

  const downloadImage = async () => {
    try {
      if (!item.image) {
        throw new Error('Invalid image data');
      }

      // Ensure the Media Library permission is granted
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library is required');
      }
      const timestamp = new Date().getTime();
      const base64Data = item.image.split(',')[1]; // Extract base64 data
      const fileUri = `${FileSystem.documentDirectory}${timestamp}.jpg`;

      // Write the base64 data to a file
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save the file to the media library
      await MediaLibrary.saveToLibraryAsync(fileUri);
      showCustomAlert('Downloaded', 'The Item is downloaded successfully!', () => {
              setAlertVisible(false);
            });

    } catch (error) {
      
      showCustomAlert('Error', 'An error occurred while downloading the image: ${error.message}', () => {
              setAlertVisible(false);
            });

    }
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const getCategoryIcon = (category) => {
    return (
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryIconText}>{category}</Text>
      </View>
    );
  };

  const updateLike = async (increment) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'data.json';
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const existingData = fileContent ? JSON.parse(fileContent) : [];
      const updatedData = existingData.map(song => {
        if (song.name === item.name) {
          song.liked = Math.max(song.liked + increment, 0); // Ensure likes do not go below 0
        }
        return song;
      });
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData));
      setLikes(likes => Math.max(likes + increment, 0)); // Update local state
showCustomAlert(increment > 0 ? 'Moved Up' : 'OOps..', `${increment > 0 ? 'Thank you that you have rate it up' : 'Sorry that you have rate it down'}!`, () => {
              setAlertVisible(false);
            });

    } catch (error) {
      console.error('Error updating like:', error);
      showCustomAlert('Error', `An error occurred while rating the item.`, () => {
              setAlertVisible(false);
            });


    }
  };

  const confirmDelete = () => {
    showCustomAlert('Confirm Delete', 'Are you sure you want to delete this item?', () =>   {
              setAlertVisible(false);
              deleteItem();

            });
    setShowCancelButton(true);

  };

  const deleteItem = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'data.json';
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const existingData = fileContent ? JSON.parse(fileContent) : [];
      const updatedData = existingData.filter(song => song.name !== item.name);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData));
      showCustomAlert('Deleted', 'The item is deleted successfully!', () => {
              setAlertVisible(false);
            });


      navigation.navigate('Home');
    } catch (error) {
      console.error('Error deleting song:', error);
      showCustomAlert('Error', 'An error occurred while deleting the item.', () => {
              setAlertVisible(false);
            });

    }
  };

  const getLikeIconColor = (likes) => {
    if (likes >= 5) return 'red';
    if (likes === 4) return 'rgba(255, 0, 0, 0.8)';
    if (likes === 3) return 'rgba(255, 0, 0, 0.6)';
    if (likes === 2) return 'rgba(255, 0, 0, 0.4)';
    if (likes === 1) return 'rgba(255, 0, 0, 0.2)';
    return 'gray';
  
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
    <View style={styles.container}>
    
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture)}>
          
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
        
          <Image 
            source={item.image ? { uri: item.image } : require('./assets/logo.png')} 
            style={styles.image} 
            onError={() => console.error('Error loading image.')}
          />
          
        </Animated.View>
      </GestureDetector>
      <TouchableOpacity 
            style={styles.threeDotMenu} 
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
      {menuVisible && (
        <View style={styles.floatingMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={shareImage}>
            <MaterialIcons name="share" size={24} color="black" />
          </TouchableOpacity>
          
           
          <TouchableOpacity style={styles.menuItem} onPress={downloadImage}>
            <MaterialIcons name="file-download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttomText}>
        <View style={styles.textRow}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.iconContainer}>
            {getCategoryIcon(item.category)}
          </View>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.description}>{item.description}</Text>
          <MaterialIcons name="favorite" size={24} color={getLikeIconColor(likes)} />
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('List', { category: '0' })}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => updateLike(1)}>
          <MaterialIcons name="trending-up" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => updateLike(-1)}>
          <MaterialIcons name="trending-down" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Update', { item })}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={confirmDelete}>
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
    <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={onConfirmAction}
        onCancel={() => setAlertVisible(false)}
        showCancelButton={showCancelButton}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 500,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  threeDotMenu: {
    position: 'absolute',
    top: 10, // Adjust as needed
    right: 10, // Adjust as needed
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  floatingMenu: {
    position: 'absolute',
    top: 10, // Adjust to position below the three-dot menu
    right: 50, // Align with the three-dot menu
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  menuItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttomText: { 
    padding: 12,
    paddingBottom: 2,
    width:'90%',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 0,
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
  categoryIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default DetailPage;
