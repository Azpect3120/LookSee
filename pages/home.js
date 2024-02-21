import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigate } from 'react-router-native';
import NavBar from './components/NavBar';

const { width, height } = Dimensions.get('window');
    
export const Home = () => {
    const [visibleItem, setVisibleItem] = useState(null); 
    const [videos, setVideos] = useState([]);
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50 
    }).current;

    useEffect(() => {
      fetch("https://looksee.gophernest.net/posts?page=1")
        .then((res) => res.json())
        .then((data) => {
            let temp = [];
          for (let i = 0; i < data.length; i++) {
            temp.push("https://mss.gophernest.net" + data[i].upload.msspath);
          }
          setVideos(temp);
        })
        .catch((err) => console.error(err));
    }, []);

    const navigate = useNavigate();
    
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const currentItem = viewableItems[0].item;
            setVisibleItem(currentItem); 
        }
    }).current;

    const renderVideo = ({ item }) => {
        console.log(item)
        
        return (<View style={styles.videoContainer}>
            <Video
                source={{ uri: item }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.COVER}
                shouldPlay={visibleItem === item}
                isLooping
                style={styles.video}
                useNativeControls={false}
            />
        </View>)
    };

    return (
        <>
            <View style={styles.container}>
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
;

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