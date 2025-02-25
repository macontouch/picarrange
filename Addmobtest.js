import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';



const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const AdmobPage = ({ navigation }) => {
  useEffect(() => {
    // Initialize Ad Manager if needed (usually handled by default)
    // No explicit initialization is needed for Ad Manager in most cases
  }, []);

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}>
      
      <View style={styles.container}>
        
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
  banner: {
    marginTop: 10,
  },
});

export default AdmobPage;
