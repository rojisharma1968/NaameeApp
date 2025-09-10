import { FlatList, View } from "react-native";
import PostCard from "../components/posts/PostCard";
import { useCallback, useRef, useState } from "react";

const demoPosts = [
  {
    id: "1",
    profileImage: "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/33668617/pexels-photo-33668617/free-photo-of-vibrant-indian-peacock-displaying-feathers.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    repeats: 23,
    likes: 6525,
    comments: 23,
    likedBy: [
      {
        name: "kriibooo",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "dianafreya",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    ],
    caption: "Loving this vibe 🌆",
    mood: "peaceful",
    wearing: "Yoga pants",
    playing: "Guitar",
    listening: "Nature sounds",
    watching: "Clouds",
    time: "3 hours ago",
  },
  {
    id: "2",
    profileImage: "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/06/24/287510_tiny.mp4",
    repeats: 23,
    likes: 6525,
    comments: 23,
    views: 1500,
    likedBy: [
      {
        name: "kriibooo",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "dianafreya",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    ],
    caption: "Loving this vibe 🌆",
    mood: "peaceful",
    wearing: "Yoga pants",
    playing: "Guitar",
    listening: "Nature sounds",
    watching: "Clouds",
    time: "5 hours ago",
  },
  {
    id: "3",
    profileImage: "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/33498262/pexels-photo-33498262/free-photo-of-autumn-leaves-with-book-and-camera-in-hanoi.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    repeats: 23,
    likes: 6525,
    comments: 23,
    likedBy: [
      {
        name: "kriibooo",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "dianafreya",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    ],
    caption: "Loving this vibe 🌆",
    mood: "peaceful",
    wearing: "Yoga pants",
    playing: "Guitar",
    listening: "Nature sounds",
    watching: "Clouds",
    time: "2 days ago",
  },
  {
    id: "4",
    profileImage: "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/33705343/pexels-photo-33705343/free-photo-of-elegant-neo-gothic-dining-hall-in-scotland.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    repeats: 23,
    likes: 6525,
    comments: 23,
    likedBy: [
      {
        name: "kriibooo",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "dianafreya",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    ],
    caption: "Loving this vibe 🌆",
    mood: "peaceful",
    wearing: "Yoga pants",
    playing: "Guitar",
    listening: "Nature sounds",
    watching: "Clouds",
    time: "5 days ago",
  },
  {
    id: "5",
    profileImage: "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "video",
    mediaUrl:
      "https://cdn.pixabay.com/video/2024/02/28/202368-918049003_tiny.mp4",
    repeats: 23,
    likes: 6525,
    comments: 23,
    views: 18000,
    likedBy: [
      {
        name: "kriibooo",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "dianafreya",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    ],
    caption: "Loving this vibe 🌆",
    mood: "peaceful",
    wearing: "Yoga pants",
    playing: "Guitar",
    listening: "Nature sounds",
    watching: "Clouds",
    time: "10 hours ago",
  },
];


const PostsScreen = () => {
  const listRef = useRef();
  const [viewableItems, setViewableItems] = useState([]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setViewableItems(viewableItems.map((item) => item.item.id));
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 40,
    minimumViewTime: 300,
  };

  return (
    <FlatList
      ref={listRef}
      data={demoPosts}
      renderItem={({ item }) => (
        <PostCard post={item} isViewable={viewableItems.includes(item.id)} />
      )}
      keyExtractor={(item) => item.id}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};

export default PostsScreen;
