import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const FileViewer = ({ route }) => {
  const { fileName } = route.params;
  const [fileContent, setFileContent] = React.useState('');

  React.useEffect(() => {
    const loadFileContent = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + 'assets/' + fileName;
        const content = await FileSystem.readAsStringAsync(fileUri);
        setFileContent(content);
      } catch (error) {
        console.error('Error loading file content:', error);
      }
    };

    loadFileContent();
  }, [fileName]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fileName}</Text>
      <Text style={styles.content}>{fileContent}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
  },
});

export default FileViewer;
