import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import SplashPage from './SplashPage';
import UploadPage from './UploadPage';
import UpdatePage from './UpdatePage';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import HomePage from './HomePage';
import SettingsPage from './SettingsPage';
import CategoryPage from './CategoryPage';
import UserAuth from './UserAuthPage';
import AdmobPage from './Addmobtest';

const Stack = createStackNavigator();

const App = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue !== null) {
        const userData = JSON.parse(jsonValue);
        setUserName(userData.name);
      }
    };

    fetchUserData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashPage"
        screenOptions={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: 'black', // Set the background color to black
          },
          headerTintColor: 'white', // Set the text color to white
          headerTitleStyle: {
            fontWeight: 'bold', // Optional: make the text bold
          },
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              {userName ? <Text style={styles.headerText}>Welcome, {userName}</Text> : null}
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <MaterialIcons name="settings" size={24} color="white" style={{ marginLeft: 16 }} />
              </TouchableOpacity>
            </View>
          ),
        })}
      >
        <Stack.Screen name="SplashPage" component={SplashPage} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} options={{ title: 'Home' }} />
        <Stack.Screen name="Upload" component={UploadPage} options={{ title: 'Upload' }} />
        <Stack.Screen name="Update" component={UpdatePage} options={{ title: 'Update' }} />
        <Stack.Screen name="List" component={ListPage} options={{ title: 'List' }} />
        <Stack.Screen name="Detail" component={DetailPage} options={{ title: 'Detail' }} />
        <Stack.Screen name="Settings" component={SettingsPage} options={{ title: 'Settings' }} />
        <Stack.Screen name="Category" component={CategoryPage} options={{ title: 'Category' }} />
        <Stack.Screen name="UserAuth" component={UserAuth} options={{ title: 'User Authentication' }} />
        <Stack.Screen name="AdmobPage" component={AdmobPage} options={{ title: 'Admob' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default App;
