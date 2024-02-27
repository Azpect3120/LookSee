import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Video } from 'expo-av';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import * as Location from 'expo-location';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const GeocodeComponent = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [carouselVisible, setCarouselVisible] = useState(false);
    const [initialRegion, setInitialRegion] = useState(null);

    const videos = [
        { uri: "https://res.cloudinary.com/dlmvtzxup/video/upload/v1707421203/LookSee/lruhuvcgrj66fyfuphuu.mp4", address: "7802 W sells dr" },
        { uri: "https://res.cloudinary.com/dlmvtzxup/video/upload/v1707421202/LookSee/qjcrfyryfm5adesx7b7x.mp4", address: "2531 S 90th Dr" },
        { uri: "https://res.cloudinary.com/dlmvtzxup/video/upload/v1707421202/LookSee/qjcrfyryfm5adesx7b7x.mp4", address: "2202 S 83rd Dr" },
        { uri: "https://res.cloudinary.com/dlmvtzxup/video/upload/v1707421203/LookSee/lruhuvcgrj66fyfuphuu.mp4", address: "2684 N Springfield St" },

    ];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();

        const fetchLocations = async () => {
            const aggregatedLocations = {};
            for (const video of videos) {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(video.address)}`;
                try {
                    const response = await axios.get(url);
                    if (response.data && response.data.length > 0) {
                        const { lat, lon } = response.data[0];
                        if (!aggregatedLocations[video.address]) {
                            aggregatedLocations[video.address] = {
                                latitude: parseFloat(lat),
                                longitude: parseFloat(lon),
                                address: video.address,
                                videos: [video],
                            };
                        } else {
                            aggregatedLocations[video.address].videos.push(video);
                        }
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    Alert.alert('Failed to retrieve location');
                }
            }
            setLocations(Object.values(aggregatedLocations));
        };

        fetchLocations();
    }, []);

    const renderItem = ({ item }) => {
        const onSwipeAnywhere = event => {
            if (event.nativeEvent.translationX < 100 && event.nativeEvent.state === State.END) {
                setCarouselVisible(false);
            }
        };

        return (
            <GestureHandlerRootView style={styles.fullScreen}>
                <PanGestureHandler
                    onGestureEvent={onSwipeAnywhere}
                    onHandlerStateChange={onSwipeAnywhere}>
                    <View style={styles.fullScreen}>
                        <Video
                            source={{ uri: item.uri }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            useNativeControls
                            style={styles.fullScreenVideo}
                        />
                    </View>
                </PanGestureHandler>
            </GestureHandlerRootView>
        );
    };

    const onMarkerPress = (location) => {
        setSelectedLocation(location);
        setCarouselVisible(true);
    };

    return (
        <View style={styles.container}>
            {initialRegion ? (
                <MapView
                    style={styles.fullMap}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                >
                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            onPress={() => onMarkerPress(location)}
                           
                            scale={1 + 0.1 * (location.videos.length - 1)} 
                        />
                    ))}
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <Text>Loading map...</Text>
                </View>
            )}
            {carouselVisible && selectedLocation && (
                <View style={styles.fullScreenCarousel}>
                    <Carousel
                        data={selectedLocation.videos}
                        renderItem={renderItem}
                        sliderWidth={width}
                        itemWidth={width}
                        onSnapToItem={index => console.log(`Selected video index: ${index}`)}
                    />
                </View>
                
            )}
           
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullMap: {
        width: width,
        height: height,
        position: 'absolute', 
        top: 0,
    },
    fullScreen: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0, 
    },
    fullScreenVideo: {
        width: '100%',
        height: '100%',
    },
    fullScreenCarousel: {
        position: 'absolute',
        top : 0,
        width: width,
        height: height, 
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', 
        zIndex: 10, 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GeocodeComponent;
