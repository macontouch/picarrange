import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './dataHelper'; // Ensure you have your CustomAlert component

const UserAuth = ({ navigation }) => {

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    const checkReturningUser = async () => {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue !== null) {
        setIsReturningUser(true);
      }
    };

    checkReturningUser();
  }, []);

  const sendOtp = () => {
    if (!phone) {
      showCustomAlert(
        'Oops..',
        'Please enter a valid phone number.',
        () => {
          setAlertVisible(false);
        }
      );
      return;
    }
    
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    setGeneratedOtp(mockOtp);
    
    showCustomAlert(
      'OTP sent!',
      'Your OTP is ' + mockOtp,
      () => {
        setAlertVisible(false);
      }
    );
  };

  const validateOtp = async () => {
    if (!name) {
      showCustomAlert(
        'Oops..',
        'Please enter your name.',
        () => {
          setAlertVisible(false);
        }
      );
      return;
    }

    if (!otp) {
      showCustomAlert(
        'Oops..',
        'Please enter the OTP.',
        () => {
          setAlertVisible(false);
        }
      );
      return;
    }

    if (otp === generatedOtp) {
      const userData = {
        name: name,
        phone: phone,
        sinked: 0,
        sinkedon: new Date().toLocaleDateString(),
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      showCustomAlert(
        'Wow..',
        'User authenticated successfully!',
        () => {
          setAlertVisible(false);
          navigation.replace('Home');
        }
      );
    } else {
      showCustomAlert(
        'Oops..',
        'Invalid OTP. Please try again.',
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

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.formBackground}>
          <Text style={styles.title}>User Authentication</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.button} onPress={sendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={validateOtp}>
            <Text style={styles.buttonText}>Validate OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Render CustomAlert */}
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onConfirm={onConfirmAction}
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
    padding: 16,
  },
  formBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background with 20% transparency
    padding: 20,
    borderRadius: 15,
    width: '90%', // Ensures the form takes up a good portion of the screen
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'rgb(32, 98, 124)',
    textAlign: 'center', // Center align the title
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#505050',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserAuth;
