import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text 
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigate } from "react-router-native";
import NavBar from "./components/NavBar";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

export const Home = () => {
  const [visibleItem, setVisibleItem] = useState(null);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    const fetchVideos = async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        console.log(`Fetching videos for page ${page}`);
        const res = await fetch(
          `https://looksee.gophernest.net/posts?page=${page}`
        );
        if (!res.ok) {
          console.error("Server responded with an error:", res.status);
          return;
        }
        const jsonData = await res.json();

        const videoUrls = jsonData.map(
          (video) => `https://mss.gophernest.net${video.upload.msspath}`
        );
        if (videoUrls.length > 0) {
          setVideos((prevVideos) => [...prevVideos, ...videoUrls]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page, loading, hasMore]);

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
        resizeMode={ResizeMode.COVER}
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
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigate("/map")}
        >
          <Feather name="map" size={36} color="black" />
        </TouchableOpacity>
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={(item, index) => index.toString()}
          pagingEnabled
          horizontal={false}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
          snapToAlignment={"start"}
          snapToInterval={height}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={() => {
            if (hasMore) setPage(page + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                style={styles.indicator}
                size="large"
                color="#0000ff"
              />
            ) : null
          }
        />
        <NavBar />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  indicatior: {
    position: "absolute",
    top: 400,
  },
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },

  header: {
    backgroundColor: "#000",
    paddingTop: 65,
    paddingLeft: 20,
    paddingBottom: 15,
    width: "100%",
    color: "#fff",
    textAlign: "left",
    fontSize: 35,
    fontFamily: "Arvo Bold",
  },
  mapButton: {
    position: 'absolute',
    top: 40, 
    left: 10,
    padding: 16,
    borderRadius: 5,
    zIndex: 10,
  },
  mapButtonText: {
      color: '#fff',
      fontSize: 16,
  },
});
