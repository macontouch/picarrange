import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// Function to generate a unique URL to bypass caching
const getUniqueUrl = (url) => `${url}?timestamp=${new Date().getTime()}`;

// Use the raw content link from GitHub
const DATA_URL = 'https://raw.githubusercontent.com/macontouch/NoteBook/refs/heads/main/data.json'; 
const FILE_URI = FileSystem.documentDirectory + 'data.json';
const VERSION_FILE_URI = FileSystem.documentDirectory + 'version.json';

const areSongsEqual = (song1, song2) => song1.name === song2.name;

export const fetchData = async () => {
  try {
    const uniqueUrl = getUniqueUrl(DATA_URL); // Use unique URL to bypass caching
    const response = await fetch(uniqueUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}, Message: ${response.statusText}`);
    }
    const remoteData = await response.json();
    console.log('Remote data:', remoteData); // Debug log

    // Check if version.json exists
    const versionFileInfo = await FileSystem.getInfoAsync(VERSION_FILE_URI);

    if (!versionFileInfo.exists) {
      // Create version.json if it doesn't exist
      await FileSystem.writeAsStringAsync(VERSION_FILE_URI, JSON.stringify({ version: 0 }));
    }

    // Load the local version data
    const localVersionData = await FileSystem.readAsStringAsync(VERSION_FILE_URI);
    const parsedLocalVersionData = localVersionData ? JSON.parse(localVersionData) : { version: 0 };
    console.log('Local version data:', parsedLocalVersionData); // Debug log

    // Load existing local data
    const localFileInfo = await FileSystem.getInfoAsync(FILE_URI);
    let existingLocalData = [];

    if (localFileInfo.exists) {
      const localData = await FileSystem.readAsStringAsync(FILE_URI);
      existingLocalData = localData ? JSON.parse(localData) : [];
    }

    // Merge local data with remote data, avoiding duplicates
    const mergedData = [...existingLocalData];

    remoteData.data.forEach(remoteSong => {
      const isDuplicate = existingLocalData.some(localSong => areSongsEqual(localSong, remoteSong));
      if (!isDuplicate) {
        mergedData.push(remoteSong);
      }
    });

    // Save the merged data and updated version
    await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(mergedData));
    await FileSystem.writeAsStringAsync(VERSION_FILE_URI, JSON.stringify({ version: remoteData.version }));
    return mergedData; // Returning the updated items
  } catch (error) {
    console.error('Error fetching data:', error);
    Alert.alert('Error', `Failed to fetch data: ${error.message}`);
    return null;
  }
};

// Function to check for updates
export const checkForUpdates = async () => {
  try {
    const uniqueUrl = getUniqueUrl(DATA_URL); // Use unique URL to bypass caching
    const response = await fetch(uniqueUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const remoteData = await response.json();
    console.log('Remote data:', remoteData); // Debug log

    const versionFileInfo = await FileSystem.getInfoAsync(VERSION_FILE_URI);

    if (!versionFileInfo.exists) {
      // Create version.json if it doesn't exist
      await FileSystem.writeAsStringAsync(VERSION_FILE_URI, JSON.stringify({ version: 0 }));
    }

    // Load the local version data
    const localVersionData = await FileSystem.readAsStringAsync(VERSION_FILE_URI);
    const parsedLocalVersionData = localVersionData ? JSON.parse(localVersionData) : { version: 0 };
    console.log('Local version data:', parsedLocalVersionData); // Debug log

    return {
      localVersion: parsedLocalVersionData.version,
      remoteVersion: remoteData.version
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return null;
  }
};