import { FlatList } from "react-native";
import PostCard from "../components/posts/PostCard";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRoute } from "@react-navigation/native";

const demoPosts = [
  {
    id: "1",
    profileImage: "https://randomuser.me/api/portraits/men/81.jpg",
    username: "johndoe",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/675764/pexels-photo-675764.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    likes: 6525,
    comments: 23,
    repeats: 23,
    caption: "Loving this vibe 🌆 #vibe #mountains #snow",
    time: "3 hours ago",
    mood: "happy",
    wearing: "Winter jacket",
    playing: "",
    type: 0,
    listening: "Nature sounds",
    watching: "",
  },
  {
    id: "2",
    profileImage: "https://randomuser.me/api/portraits/men/95.jpg",
    username: "alexsmith",
    mediaType: "video",
    mediaUrl:
      "https://cdn.coverr.co/videos/user-ai-generation-qMK3Z2p23VxA/360p.mp4",
    banner:
      "https://images.pexels.com/photos/11729760/pexels-photo-11729760.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    likes: 1200,
    comments: 12,
    repeats: 5,
    views: 2542,
    caption: "funny 🤣",
    time: "1 hour ago",
    mood: "excited",
    wearing: "Casual t-shirt",
    playing: "Piano",
    type: 1,
    listening: "Pop music",
    watching: "Comedy show",
  },
  {
    id: "3",
    profileImage: "https://randomuser.me/api/portraits/women/10.jpg",
    username: "emilyrose",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/849643/pexels-photo-849643.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    likes: 3400,
    comments: 30,
    repeats: 10,
    caption: "Coffee time ☕️",
    time: "2 hours ago",
    mood: "relaxed",
    wearing: "Summer dress",
    playing: "",
    type: 0,
    listening: "Jazz",
    watching: "",
  },
  {
    id: "4",
    profileImage: "https://randomuser.me/api/portraits/women/60.jpg",
    username: "sarahj",
    mediaType: "video",
    mediaUrl: "https://pixabay.com/videos/download/video-237366_tiny.mp4",
    banner:
      "https://images.pexels.com/photos/844297/pexels-photo-844297.jpeg?auto=compress&cs=tinysrgb&w=640dpr=1",
    likes: 2100,
    comments: 15,
    repeats: 6,
    views: 1360,
    caption: "Clouds feels 💨",
    time: "5 hours ago",
    mood: "peaceful",
    wearing: "Yoga pants",
    playing: "Guitar",
    type: 1,
    listening: "Nature sounds",
    watching: "Clouds",
  },
  {
    id: "5",
    profileImage: "https://randomuser.me/api/portraits/women/95.jpg",
    username: "michaelb",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/30874496/pexels-photo-30874496/free-photo-of-night-view-of-hannover-s-telekom-tower.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    banner:
      "https://images.pexels.com/photos/2065281/pexels-photo-2065281.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    likes: 900,
    comments: 8,
    repeats: 2,
    caption: "City lights ✨",
    time: "4 hours ago",
    mood: "inspired",
    wearing: "Business casual",
    playing: "",
    type: 0,
    listening: "Ambient sounds",
    watching: "City view",
  },
];

const HomeScreen = () => {
  const route = useRoute();
  const listRef = useRef();
  const [viewableItems, setViewableItems] = useState([]);

  useEffect(() => {
    if (route.params?.scrollToTop && listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [route.params?.scrollToTop]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setViewableItems(viewableItems.map((item) => item.item.id));
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 40,
    minimumViewTime: 300,
  };

  const renderItem = useCallback(
    ({ item }) => (
      <PostCard post={item} isViewable={viewableItems.includes(item.id)} />
    ),
    [viewableItems]
  );

  return (
    <FlatList
      ref={listRef}
      data={demoPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      removeClippedSubviews={true}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={3}
      updateCellsBatchingPeriod={100}
    />
  );
};

export default HomeScreen;
