import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';

const ListPage = ({ route, navigation }) => {
  const { category: initialCategory } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('A');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }

    const loadData = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + 'data.json';
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        
        if (fileInfo.exists) {
          const savedData = await FileSystem.readAsStringAsync(fileUri);
          const parsedData = savedData ? JSON.parse(savedData) : [];
          setData(parsedData);
        } else {
          Alert.alert('Error', 'data.json file does not exist.');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [initialCategory]);




useEffect(() => {
  if (initialCategory !== undefined) {
    setSelectedCategory(initialCategory);
  }

  

  const loadData = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'data.json';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const savedData = await FileSystem.readAsStringAsync(fileUri);
        const parsedData = savedData ? JSON.parse(savedData) : [];
        setData(parsedData);
      } else {
        Alert.alert('Error', 'data.json file does not exist.');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  loadData();
}, [initialCategory]);

useEffect(() => {
  console.log('Data:', data); // Debug log
}, [data]);

  const categories = [
    { label: 'All', value: 'A' },
    { label: 'Bengali', value: 'B' },
    { label: 'Hindi', value: 'H' },
    { label: 'English', value: 'E' },
    { label: 'Others', value: 'O' },
  ];

  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const getCategoryIcon = (category) => (
    <View style={styles.categoryIcon}>
      <Text style={styles.categoryIconText}>{category}</Text>
    </View>
  );

  const getLikeIconColor = (likes) => {
    if (likes >= 5) return 'red';
    if (likes === 4) return 'rgba(255, 0, 0, 0.8)';
    if (likes === 3) return 'rgba(255, 0, 0, 0.6)';
    if (likes === 2) return 'rgba(255, 0, 0, 0.4)';
    if (likes === 1) return 'rgba(255, 0, 0, 0.2)';
    return 'gray';
  };

  const handleSort = (sortType) => {
    let sortedData;
    switch (sortType) {
      case 'A-Z':
        sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        sortedData = [...data].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Most Liked':
        sortedData = [...data].sort((a, b) => b.liked - a.liked);
        break;
      default:
        sortedData = data;
    }
    setData(sortedData);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'A' || item.category === selectedCategory)
  );

  return (
    <MenuProvider>
      <ImageBackground
        source={require('./assets/bg.png')}
        style={styles.background}>
        <View style={styles.container}>
        <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
            <MaterialIcons name="home" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.searchSelect}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedCategory(value);
              setSearchQuery(''); // Reset search query when changing category
            }}
            items={categories}
            value={selectedCategory}
            placeholder={{}} // Empty placeholder to remove "Select an Item..."
            style={pickerSelectStyles}
          />
          </View>
            <View style={styles.iconButton}>
            <Text style={styles.songCountText}>
              {filteredData.length}/{data.length}
            </Text>
          </View>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search by name"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.input, styles.searchInput]}
            />
            <Menu>
              <MenuTrigger>
                <MaterialIcons name="more-vert" size={32} color="black" />
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.menuOptions}>
              <View style={styles.iconRow}>
                <MenuOption onSelect={() => handleSort('A-Z')}>
                  <View style={styles.menuOption}>
                    <Image
                      source={require('./assets/ico_a-z.png')}
                      style={styles.sortIcon}
                    />
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => handleSort('Z-A')}>
                  <View style={styles.menuOption}>
                    <Image
                      source={require('./assets/ico_z-a.png')}
                      style={styles.sortIcon}
                    />
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => handleSort('Most Liked')}>
                  <View style={styles.menuOption}>
                    <Image
                      source={require('./assets/ico_h.png')}
                      style={styles.sortIcon}
                    />
                  </View>
                </MenuOption>
                </View>
              </MenuOptions>
              
            </Menu>
          </View>
          <FlatList
            data={filteredData}
            style={styles.list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Detail', { item })}
                style={styles.itemContainer}>
                <Image
                  source={{ uri: item.t_image }}
                  style={styles.thumbnail}
                />
                <View style={styles.itemTextContainer}>
                  <Text>{item.name}</Text>
                  <Text>{item.description}</Text>
                </View>
                <View style={styles.iconContainer}>
                  {getCategoryIcon(item.category)}
                  <MaterialIcons
                    name="favorite"
                    size={24}
                    color={getLikeIconColor(item.liked)}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ImageBackground>
    </MenuProvider>
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
  list: {
    // 50% transparent white background
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingLeft:10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  itemTextContainer: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 16, // Add margin-right to prevent the scrollbar from touching the icons
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
iconRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  paddingVertical: 2,
  },
sortIcon: {
  width: 28,
  height: 28,
  marginRight: 5, // Add some space between the icon and the text
  },
  menuOptions: {
  marginTop: -105, // Adjust position to align with three-dot icon
  marginLeft: -30, // Adjust position to align with three-dot icon
},
 songCountText: {
    color: 'white',
    fontSize: 12,
  },
/*
iconButton: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10,
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
    width:28,
    height:28,
  },
*/
iconButton: {
  marginTop: -10,
  marginRight: 10,
  backgroundColor : 'rgba(50, 50, 50, 1)',
  width:50,
  height:50,
  alignItems: 'center',
  paddingTop:13,
  
},
searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  paddingLeft:10,
},
searchSelect: {
  flex: 1,
  width: '50%',
  marginRight:10,
}
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 12,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 10,
  },
});

export default ListPage;
