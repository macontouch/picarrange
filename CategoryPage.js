import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, TouchableOpacity, Switch, ImageBackground, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomAlert from './dataHelper';

const CategoryPage = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [denotedBy, setDenotedBy] = useState('');
  const [pinnedToHome, setPinnedToHome] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [showCancelButton, setShowCancelButton] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const jsonValue = await AsyncStorage.getItem('categories');
    if (jsonValue != null) {
      setCategories(JSON.parse(jsonValue));
    }
  };

  const saveCategories = async (newCategories) => {
    await AsyncStorage.setItem('categories', JSON.stringify(newCategories));
  };

  const handleAddCategory = () => {
    if (!category || !denotedBy || categories.some(cat => cat.category === category)) {
      setAlertTitle('Oops...');
      setAlertMessage('Please fill all fields and ensure category name is unique.');
      setOnConfirmAction(() => () => setAlertVisible(false));
      setShowCancelButton(false);
      setAlertVisible(true);
      return;
    }

    const newCategories = [...categories, { category, denotedby: denotedBy, pintohome: pinnedToHome }];
    setCategories(newCategories);
    saveCategories(newCategories);
    resetForm();
    Keyboard.dismiss();
    setAlertTitle('Wow..');
      setAlertMessage('A new category created successfully.');
      setOnConfirmAction(() => () => setAlertVisible(false));
      setShowCancelButton(false);
      setAlertVisible(true);
  };

  const handleEditCategory = () => {
    if (categories.some((cat, index) => cat.category === category && index !== editIndex)) {
      setAlertTitle('Oops...');
      setAlertMessage('Category name already exists.');
      setOnConfirmAction(() => () => setAlertVisible(false));
      setShowCancelButton(false);
      setAlertVisible(true);
      return;
    }

    const newCategories = categories.map((cat, index) => {
      if (index === editIndex) {
        return { category, denotedby: denotedBy, pintohome: pinnedToHome };
      }
      return cat;
    });
    setCategories(newCategories);
    saveCategories(newCategories);
    resetForm();
    Keyboard.dismiss();
    setAlertTitle('Wow..');
    setAlertMessage('The category updated successfully.');
    setOnConfirmAction(() => () => setAlertVisible(false));
    setShowCancelButton(false);
    setAlertVisible(true);
    
  };

  const handleDeleteCategory = (index) => {
    setAlertTitle('Confirm Delete');
    setAlertMessage('Are you sure you want to delete this category?');
    setOnConfirmAction(() => () => {
      const newCategories = categories.filter((_, i) => i !== index);
      setCategories(newCategories);
      saveCategories(newCategories);
      setAlertVisible(false);
      setTimeout(() => {
        setAlertTitle('Success');
        setAlertMessage('Category deleted successfully.');
        setOnConfirmAction(() => setAlertVisible(false));
        setShowCancelButton(false);
        setAlertVisible(true);
      }, 100); // Small delay to ensure the success message appears properly
    });
    setShowCancelButton(true);
    setAlertVisible(true);
  };

  const resetForm = () => {
    setCategory('');
    setDenotedBy('');
    setPinnedToHome(false);
    setEditMode(false);
    setEditIndex(null);
  };

  const handleEditButton = (index) => {
    setCategory(categories[index].category);
    setDenotedBy(categories[index].denotedby);
    setPinnedToHome(categories[index].pintohome);
    setEditMode(true);
    setEditIndex(index);
  };

  return (
    <ImageBackground
      source={require('./assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Denoted By"
          value={denotedBy}
          onChangeText={setDenotedBy}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Pinned to Home</Text>
          <Switch
            value={pinnedToHome}
            onValueChange={setPinnedToHome}
          />
        </View>
        <View style={styles.backcontainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
              <MaterialIcons name="home" size={24} color="white" />
              <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>

            {editMode ? (
              <TouchableOpacity style={styles.iconButton} onPress={handleEditCategory}>
                <MaterialIcons name="save" size={24} color="white" />
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.iconButton} onPress={handleAddCategory}>
                <MaterialIcons name="save" size={24} color="white" />
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <Text>{item.category} ({item.denotedby})</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => handleEditButton(index)}>
                    <MaterialIcons name="edit" size={24} color="rgba(33, 99, 125, 1)" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCategory(index)}>
                    <MaterialIcons name="delete" size={24} color="rgba(237, 111, 85, 1)" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
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
    padding: 20,
  },
  backcontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  label: {
    margin: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default CategoryPage;
