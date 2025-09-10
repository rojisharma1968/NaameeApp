// Modified ProfileScreen.js
import { FlatList, View, Text } from "react-native";
import ProfileHeader from "../components/profile/ProfileHeader";
import Tabs from "../components/Tabs";
import GridPostItem from "../components/GridPostItem";
// Import the new component
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { useAutoScrollToTop } from "../hooks/useAutoScrollToTop";
import PrivacyPostHeader from "../components/PrivacyPostHeader";

const demoPosts = [
  {
    id: "1",
    profileImage:
      "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "image",
    mediaUrl:
          "https://images.pexels.com/photos/33668617/pexels-photo-33668617/free-photo-of-vibrant-indian-peacock-displaying-feathers.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    repeats: 23,
    smile: 6525,
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
    time: "3 hours ago",
  },
  {
    id: "2",
    profileImage:
      "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/06/24/287510_tiny.mp4",
    repeats: 0,
    smile: 0,
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
    time: "3 hours ago",
  },
  {
    id: "3",
    profileImage:
      "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/33498262/pexels-photo-33498262/free-photo-of-autumn-leaves-with-book-and-camera-in-hanoi.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    repeats: 10,
    smile: 0,
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
    time: "3 hours ago",
  },
  {
    id: "4",
    profileImage:
      "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "image",
    mediaUrl:
      "https://images.pexels.com/photos/33705343/pexels-photo-33705343/free-photo-of-elegant-neo-gothic-dining-hall-in-scotland.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
    repeats: 0,
    smile: 6525,
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
    time: "3 hours ago",
  },
  {
    id: "5",
    profileImage:
      "https://randomuser.me/api/portraits/men/68.jpg",
    username: "johndoe",
    mediaType: "video",
    mediaUrl:
      "https://cdn.pixabay.com/video/2024/02/28/202368-918049003_tiny.mp4",
    repeats: 6,
    smile: 6525,
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
    time: "3 hours ago",
  },
];


const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("grid");
  const listRef = useRef(null);
  useAutoScrollToTop(listRef);
  const scrollPositions = useRef({
    grid: 0,
    list: 0,
    clicked: 0,
    repeat: 0,
  });

  const isSingleColumn = activeTab === "list";
  const numColumns = isSingleColumn ? 1 : 3;
  const flatListKey = isSingleColumn ? "single" : "multi";

  const filteredPosts = useMemo(() => {
    if (activeTab === "repeat") return demoPosts.filter((p) => p.repeats > 0);
    if (activeTab === "clicked") return demoPosts.filter((p) => p.smile > 0);
    return demoPosts;
  }, [activeTab]);

  const renderItem = useCallback(
    ({ item }) => <GridPostItem item={item} layout={activeTab} />,
    [activeTab]
  );
  const repeatPosts = demoPosts.filter((item) => item.repeats > 0).length;
  const ListHeader = useMemo(
    () => (
      <>
        <ProfileHeader
          avatarUrl="https://randomuser.me/api/portraits/women/81.jpg"
          totalPosts={demoPosts.length}
          repeatPosts={repeatPosts}
        />
        <Tabs
          wrapClass="bg-zinc-100"
          tabs={[
            { key: "grid", icon: "grid" },
            { key: "list", icon: "list" },
            { key: "clicked", icon: "smile" },
            { key: "repeat", icon: "repeat" },
          ]}
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
          }}
          useIcons
        />
        <PrivacyPostHeader activeTab={activeTab} />
      </>
    ),
    [activeTab]
  );

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: scrollPositions.current[activeTab],
      animated: false,
    });
  }, [activeTab]);

  return (
    <FlatList
      ref={listRef}
      className="flex-1 bg-white"
      key={flatListKey}
      data={filteredPosts}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        <View className="items-center my-6">
          <Text className="text-gray-500 text-base">
            You haven't posted anything yet
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={10}
      onScroll={(e) => {
        scrollPositions.current[activeTab] = e.nativeEvent.contentOffset.y;
      }}
    />
  );
};

export default ProfileScreen;
