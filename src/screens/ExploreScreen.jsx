import { Dimensions, FlatList, View } from "react-native";
import { useRef, useState } from "react";
import Tabs from "../components/Tabs";
import GridPostItem from "../components/GridPostItem";
import PagerView from "react-native-pager-view";
const SCREEN_WIDTH = Dimensions.get("window").width;
const explorePosts = [
  // Trending
  {
    id: "1",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/15/21/04/golden-retriever-puppy-amber-9661916_1280.jpg",
    type: "trending",
  },
  {
    id: "2",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/04/29/275498_tiny.mp4",
    type: "trending",
    views: 1500,
  },
  {
    id: "3",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/23/17/50/wheat-9676363_960_720.jpg",
    type: "trending",
  },
  {
    id: "4",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/03/08/263305_tiny.mp4",
    type: "trending",
    views: 150000,
  },
  {
    id: "5",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/23/17/50/wheat-9676363_960_720.jpg",
    type: "trending",
  },
  {
    id: "6",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/15/21/04/golden-retriever-puppy-amber-9661916_1280.jpg",
    type: "trending",
  },
  {
    id: "7",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/15/21/04/golden-retriever-puppy-amber-9661916_1280.jpg",
    type: "trending",
  },
  {
    id: "8",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/04/29/275498_tiny.mp4",
    type: "trending",
    views: 1800000,
  },
  {
    id: "9",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/23/17/50/wheat-9676363_960_720.jpg",
    type: "trending",
  },
  {
    id: "10",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/03/08/263305_tiny.mp4",
    type: "trending",
    views: 2500,
  },
  {
    id: "5",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/23/17/50/wheat-9676363_960_720.jpg",
    type: "trending",
  },
  {
    id: "11",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/15/21/04/golden-retriever-puppy-amber-9661916_1280.jpg",
    type: "trending",
  },
  {
    id: "12",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/15/21/04/golden-retriever-puppy-amber-9661916_1280.jpg",
    type: "trending",
  },
  {
    id: "13",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/04/29/275498_tiny.mp4",
    type: "trending",
    views: 12000,
  },
  {
    id: "14",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/23/17/50/wheat-9676363_960_720.jpg",
    type: "trending",
  },

  // Popular
  {
    id: "15",
    mediaType: "video",
    mediaUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    type: "popular",
    views: 1800000000000,
  },
  {
    id: "16",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2023/04/11/09/08/norway-7916632_1280.jpg",
    type: "popular",
  },
  {
    id: "17",
    mediaType: "image",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2025/06/03/05/11/louvre-9638315_1280.jpg",
    type: "popular",
  },
];

const tabs = [
  { key: "trending", label: "Trending" },
  { key: "popular", label: "Popular" },
];

const ExploreScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef(null);
  const isManualPressRef = useRef(false);

  const tabs = [
    { key: "trending", label: "Trending" },
    { key: "popular", label: "Popular" },
  ];

  const handleTabPress = (index) => {
    if (index === currentPage) return;

    isManualPressRef.current = true;
    setCurrentPage(index); // Update instantly for UI
    pagerRef.current?.setPage(index);

    // Reset manual flag after transition (rough estimate)
    setTimeout(() => {
      isManualPressRef.current = false;
    }, 300); // Match with PagerView swipe duration
  };

  const renderPostList = (type) => {
    const filtered = explorePosts.filter((post) => post.type === type);
    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id + item.type}
        numColumns={3}
        renderItem={({ item }) => <GridPostItem item={item} />}
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
          handleTabPress(index);
        }}
        wrapClass="bg-white"
      />

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageScroll={(e) => {
          if (isManualPressRef.current) return;

          const { offset, position } = e.nativeEvent;
          const nextIndex =
            offset === 0 ? position : Math.round(position + offset);
          if (nextIndex !== currentPage) {
            setCurrentPage(nextIndex);
          }
        }}
      >
        <View key="trending">{renderPostList("trending")}</View>
        <View key="popular">{renderPostList("popular")}</View>
      </PagerView>
    </View>
  );
};

export default ExploreScreen;
