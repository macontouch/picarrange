import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import UploadPage from './UploadPage';
import UpdatePage from './UpdatePage';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import HomePage from './HomePage';
import FileViewer from './FileViewer';
import SettingsPage from './SettingsPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black', // set the background color to black
          },
          headerTintColor: 'white', // set the text color to white
          headerTitleStyle: {
            fontWeight: 'bold', // optional: make the text bold
          },
        }}
      >
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Upload" component={UploadPage} />
        <Stack.Screen name="Update" component={UpdatePage} />
        <Stack.Screen name="List" component={ListPage} />
        <Stack.Screen name="Detail" component={DetailPage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="FileViewer" component={FileViewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
