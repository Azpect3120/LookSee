import React, { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';
import { useNavigate } from 'react-router-native';
import NavBar from './components/NavBar';

const { width, height } = Dimensions.get('window');

export const Home = () => {
    const [visibleItem, setVisibleItem] = useState(null);
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;
    const videos = [
        "https://res.cloudinary.com/dlmvtzxup/video/upload/v1707421203/LookSee/lruhuvcgrj66fyfuphuu.mp4",
        "https://res.cloudinary.com/dlmvtzxup/video/upload/v1707421202/LookSee/qjcrfyryfm5adesx7b7x.mp4"
    ];

    const navigate = useNavigate();

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const currentItem = viewableItems[0].item;
            setVisibleItem(currentItem);
        }
    }).current;

    const renderVideo = ({ item }) => (
        <View style={styles.videoContainer}>
            <Video
                source={{ uri: item }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={visibleItem === item}
                isLooping
                style={styles.video}
                useNativeControls={false}
            />
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity style={styles.mapButton} onPress={() => navigate('/map')}>
                    <Text style={styles.mapButtonText}>Map</Text>
                </TouchableOpacity>
                <FlatList
                    data={videos}
                    renderItem={renderVideo}
                    keyExtractor={(item, index) => index.toString()}
                    pagingEnabled
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    decelerationRate={'fast'}
                    snapToAlignment={"start"}
                    snapToInterval={height}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                />
                <NavBar />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
    videoContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    mapButton: {
        position: 'absolute',
        top: 40, 
        left: 10,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        zIndex: 10,
    },
    mapButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
    videoContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    
    header: {
        backgroundColor: '#000',
        paddingTop: 65,
        paddingLeft: 20,
        paddingBottom: 15,
        width: '100%',
        color: '#fff',
        textAlign: 'left',
        fontSize: 35,
        fontFamily: 'Arvo Bold',
    },
})