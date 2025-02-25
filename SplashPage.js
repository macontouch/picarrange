import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ImageBackground, Animated, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './dataHelper';

const SplashPage = ({ navigation }) => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const [alertVisible, setAlertVisible] = useState(false);
  const timeoutRef = useRef(null);

  const navigateHome = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    navigation.replace('Home');
  };

  const navigateUserAuth = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    navigation.replace('UserAuth');
  };

  const navigateCategory = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    navigation.replace('Category');
  };

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const checkUserAndCategories = async () => {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson == null || JSON.parse(userJson).name == null) {
        navigateUserAuth();
      } else {
        const categoriesJson = await AsyncStorage.getItem('categories');
        if (categoriesJson == null || JSON.parse(categoriesJson).length === 0) {
          setAlertVisible(true);
        } else {
          timeoutRef.current = setTimeout(() => {
            navigateHome();
          }, 5000);
        }
      }
    };

    checkUserAndCategories();
  }, [navigation, translateY]);

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    navigateCategory();
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Animated.Text style={[styles.text, { transform: [{ translateY }] }]}>
          PIC ARRANGE
        </Animated.Text>
        <Image source={require('./assets/logo.png')} style={styles.imagel} />
        <TouchableOpacity style={styles.homeContainer} onPress={navigateHome}>
          <Image source={require('./assets/ico_home.png')} style={styles.imageh} />
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          title="Oops..."
          message="Is it your first time? I think you need to create your categories first."
          onConfirm={handleAlertConfirm}
          onCancel={() => setAlertVisible(false)}
          showCancelButton={false}
        />
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
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: 'rgb(32, 98, 124)',
    marginBottom: 20,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  imagel: {
    width: 300,
    height: 300,
    marginBottom: 50,
  },
  homeContainer: {
    position: 'absolute',
    bottom: 50,
  },
  imageh: {
    width: 100,
    height: 100,
  },
});

export default SplashPage;
