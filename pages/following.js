import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

const videoData = [
  { id: '1', title: 'McDonalds', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/McDonald%27s_square_2020.svg/800px-McDonald%27s_square_2020.svg.png' },
  { id: '2', title: 'Burger King', thumbnail: 'https://theflashtoday.com/wp-content/uploads/2017/06/Burger-King-logo-feature.png' },
  { id: '3', title: 'Wendys', thumbnail: 'https://cdn.mos.cms.futurecdn.net/j9fdSE7n8JMneh4E6hCCbR.jpg' },
  { id: '4', title: 'Chipotle', thumbnail: 'https://www.ocregister.com/wp-content/uploads/2023/06/OCR-L-CHIPOTLE-0501-e1685653186689.jpg?w=1024' },
];

export const Following = () => {
  const [query, setQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(videoData);

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = videoData.filter(video => video.title.toLowerCase().includes(text.toLowerCase()));
    setFilteredVideos(filtered);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for videos..."
          value={query}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredVideos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.videoItem}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <Text style={styles.videoTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    width: "100%",
    height: "100%",

  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  videoItem: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 20,
  },
  thumbnail: {
    height: 200,
    borderRadius: 12,
  },
  videoTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
