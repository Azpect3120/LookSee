import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';

const messages = [
  { id: '1', from: 'John Doe', subject: 'Meeting Tomorrow', summary: 'Hey, just a reminder...', profileImg: 'https://placekitten.com/200/200', time: '2h ago' },
  { id: '2', from: 'Jane Smith', subject: 'Project Update', summary: 'Project X is moving...', profileImg: 'https://placekitten.com/200/200', time: '5h ago' },
];

const follows = [
  { id: '1', name: 'Emily R.', time: '1d ago', action: 'started following you', profileImg: 'https://placekitten.com/200/200' },
  { id: '2', name: 'Mark S.', time: '2d ago', action: 'started following you', profileImg: 'https://placekitten.com/200/200' },
];

const likes = [
  { id: '1', name: 'Sarah K.', time: '3h ago', action: 'liked your post', profileImg: 'https://placekitten.com/200/200' },
  { id: '2', name: 'Joshua L.', time: '5h ago', action: 'liked your post', profileImg: 'https://placekitten.com/200/200' },
];

export const Inbox = () => {
  const [activeSegment, setActiveSegment] = useState('messages');

  const renderData = () => {
    switch (activeSegment) {
      case 'messages':
        return messages;
      case 'follows':
        return follows;
      case 'likes':
        return likes;
      default:
        return messages;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.segmentControl}>
          <TouchableOpacity onPress={() => setActiveSegment('messages')}>
            <Text style={activeSegment === 'messages' ? styles.segmentActive : styles.segment}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveSegment('follows')}>
            <Text style={activeSegment === 'follows' ? styles.segmentActive : styles.segment}>Follows</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveSegment('likes')}>
            <Text style={activeSegment === 'likes' ? styles.segmentActive : styles.segment}>Likes</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={renderData()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.messageItem}>
              <Image source={{ uri: item.profileImg }} style={styles.profileImg} />
              <View style={styles.messageContent}>
                <Text style={styles.fromText}>{item.name || item.from}</Text>
                <Text style={styles.summaryText}>{item.action || item.summary}</Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
              {activeSegment === 'messages' && <Icon name="chevron-right" type="entypo" color="#ccc" />}
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
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
  },
  segmentControl: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  segment: {
    color: '#666',
    fontSize: 16,
  },
  segmentActive: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  fromText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#aaa',
    marginRight: 10,
  },
});
