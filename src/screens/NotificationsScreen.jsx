import { FlatList, View } from "react-native";
import { useRef, useState } from "react";
import Tabs from "../components/Tabs";
import NotificationItem from "../components/notification/NotificationItem";
import { useAutoScrollToTop } from "../hooks/useAutoScrollToTop";
import PagerView from "react-native-pager-view";

const initialNotifications = [
  {
    id: "1",
    source: "following",
    type: "smile",
    user: {
      name: "Aisha Khan",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    target: {
      label: "your post",
      thumbnail: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
      mediaType: "image",
    },
    time: "2025-07-06T14:20:00Z",
  },
  {
    id: "2",
    source: "others",
    type: "repeat",
    user: {
      name: "Zaid Ali",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    target: {
      label: "your video",
      thumbnail: "https://cdn.pixabay.com/video/2024/06/02/214940_tiny.mp4",
      mediaType: "video",
    },
    time: "2025-07-05T18:45:00Z",
  },
  {
    id: "3",
    source: "following",
    type: "comment",
    user: {
      name: "Fatima Noor",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    target: {
      label: "your photo",
      thumbnail: "https://images.unsplash.com/photo-1535930749574-1399327ce78f",
      mediaType: "image",
    },
    comment: "Loved this one!",
    time: "2025-07-04T09:00:00Z",
  },
  {
    id: "4",
    source: "others",
    type: "follow",
    user: {
      name: "Bilal Qureshi",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    time: "2025-07-03T12:15:00Z",
  },
  {
    id: "5",
    source: "following",
    type: "comment",
    user: {
      name: "Nida Rehman",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    target: {
      label: "your video",
      thumbnail: "https://cdn.pixabay.com/video/2025/04/29/275498_tiny.mp4",
      mediaType: "video",
    },
    comment: "Such a vibe 🔥",
    time: "2025-07-02T08:10:00Z",
  },
  {
    id: "6",
    source: "others",
    type: "repeat",
    user: {
      name: "Ahmed Raza",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    target: {
      label: "your post",
      thumbnail: "https://images.unsplash.com/photo-1581291518830-4f60d6d5d97f",
      mediaType: "image",
    },
    time: "2025-07-01T16:50:00Z",
  },
  {
    id: "7",
    source: "following",
    type: "follow",
    user: {
      name: "Sana Malik",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    time: "2025-06-30T19:25:00Z",
  },
  {
    id: "8",
    source: "others",
    type: "comment",
    user: {
      name: "Hamza Tariq",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    },
    target: {
      label: "your selfie",
      thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      mediaType: "image",
    },
    comment: "Looking great!",
    time: "2025-06-29T11:00:00Z",
  },
  {
    id: "9",
    source: "following",
    type: "repeat",
    user: {
      name: "Maryam Shah",
      avatar: "https://randomuser.me/api/portraits/women/49.jpg",
    },
    target: {
      label: "your post",
      thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      mediaType: "image",
    },
    time: "2025-06-28T07:15:00Z",
  },
  {
    id: "10",
    source: "others",
    type: "smile",
    user: {
      name: "Usman Khalid",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    },
    target: {
      label: "your quote",
      thumbnail: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
      mediaType: "image",
    },
    time: "2025-06-27T14:40:00Z",
  },
  {
    id: "11",
    source: "others",
    type: "follow",
    user: {
      name: "Noor Fatima",
      avatar: "https://randomuser.me/api/portraits/women/54.jpg",
    },
    time: "2025-06-26T09:30:00Z",
  },
  {
    id: "12",
    source: "following",
    type: "smile",
    user: {
      name: "Zara Ahmed",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    target: {
      label: "your post",
      thumbnail: "https://images.unsplash.com/photo-1558981001-f2c585cddf6a",
      mediaType: "image",
    },
    time: "2025-06-25T20:15:00Z",
  },
  {
    id: "13",
    source: "others",
    type: "repeat",
    user: {
      name: "Ali Nawaz",
      avatar: "https://randomuser.me/api/portraits/men/90.jpg",
    },
    target: {
      label: "your vlog",
      thumbnail: "https://cdn.pixabay.com/video/2025/04/29/275498_tiny.mp4",
      mediaType: "video",
    },
    time: "2025-06-24T13:00:00Z",
  },
  {
    id: "14",
    source: "following",
    type: "comment",
    user: {
      name: "Saba Qureshi",
      avatar: "https://randomuser.me/api/portraits/women/38.jpg",
    },
    target: {
      label: "your recipe post",
      thumbnail: "https://images.unsplash.com/photo-1546069901-eacef0df6022",
      mediaType: "image",
    },
    comment: "I need this recipe 😍",
    time: "2025-06-23T08:45:00Z",
  },
  {
    id: "15",
    source: "others",
    type: "smile",
    user: {
      name: "Daniyal Malik",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
    },
    target: {
      label: "your throwback post",
      thumbnail: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368",
      mediaType: "image",
    },
    time: "2025-06-22T11:20:00Z",
  },
  {
    id: "16",
    source: "others",
    type: "repeat",
    user: {
      name: "Mahnoor Rizvi",
      avatar: "https://randomuser.me/api/portraits/women/81.jpg",
    },
    target: {
      label: "your reel",
      thumbnail: "https://cdn.pixabay.com/video/2025/03/08/263305_tiny.mp4",
      mediaType: "video",
    },
    time: "2025-06-21T10:10:00Z",
  },
  {
    id: "17",
    source: "following",
    type: "follow",
    user: {
      name: "Shayan Asif",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    time: "2025-06-20T06:35:00Z",
  },
  {
    id: "18",
    source: "others",
    type: "smile",
    user: {
      name: "Iqra Nazeer",
      avatar: "https://randomuser.me/api/portraits/women/71.jpg",
    },
    target: {
      label: "your moment",
      thumbnail:
        "https://cdn.pixabay.com/video/2023/01/30/148594-794221537_tiny.mp4",
      mediaType: "video",
    },
    time: "2025-06-19T14:00:00Z",
  },
  {
    id: "19",
    source: "following",
    type: "repeat",
    user: {
      name: "Taha Rauf",
      avatar: "https://randomuser.me/api/portraits/men/57.jpg",
    },
    target: {
      label: "your post",
      thumbnail: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      mediaType: "image",
    },
    time: "2025-06-18T17:10:00Z",
  },
  {
    id: "20",
    source: "others",
    type: "comment",
    user: {
      name: "Mehak Bashir",
      avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    },
    target: {
      label: "your post",
      thumbnail: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6",
      mediaType: "image",
    },
    comment: "Pure vibes ✨",
    time: "2025-06-17T07:55:00Z",
  },
];

const NotificationScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [notifications, setNotifications] = useState(initialNotifications);
  const pagerRef = useRef(null);
  const isManualPressRef = useRef(false);

  const tabs = [
    { key: "all", label: "All" },
    { key: "following", label: "Following" },
  ];

  const allRef = useRef(null);
  const followingRef = useRef(null);

  const flatListRefs = {
    all: allRef,
    following: followingRef,
  };

  useAutoScrollToTop(allRef);
  useAutoScrollToTop(followingRef);

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTabChange = (tabKey, index) => {
    if (index === currentPage) return;

    isManualPressRef.current = true;
    setCurrentPage(index);
    flatListRefs[tabKey]?.current?.scrollToOffset({ offset: 0, animated: false });
    pagerRef.current?.setPage(index);
  };

  const renderNotificationList = (sourceKey) => {
    const filtered =
      sourceKey === "all"
        ? notifications
        : notifications.filter((n) => n.source === sourceKey);

    return (
      <FlatList
        ref={flatListRefs[sourceKey]}
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem {...item} onDelete={() => handleDelete(item.id)} />}
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        className="bg-gray-100"
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Tabs
        tabs={tabs}
        activeTab={tabs[currentPage].key}
        onChange={(key) => {
          const index = tabs.findIndex((t) => t.key === key);
          handleTabChange(key, index);
        }}
      />

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageScroll={(e) => {
          if (isManualPressRef.current) return;

          const { offset, position } = e.nativeEvent;
          const nextIndex = Math.round(position + offset);
          if (nextIndex !== currentPage) {
            const nextKey = tabs[nextIndex].key;
            flatListRefs[nextKey]?.current?.scrollToOffset({ offset: 0, animated: false });
            setCurrentPage(nextIndex);
          }
        }}
        onPageSelected={(e) => {
          const position = e.nativeEvent.position;
          if (position !== currentPage) {
            setCurrentPage(position);
          }
          isManualPressRef.current = false;
        }}
      >
        <View key="all">{renderNotificationList("all")}</View>
        <View key="following">{renderNotificationList("following")}</View>
      </PagerView>
    </View>
  );
};

export default NotificationScreen;