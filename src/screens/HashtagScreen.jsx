import { useState } from "react";
import GridPostItem from "../components/GridPostItem";
import HashtagHeader from "../components/Hashtag/HashtagHeader";
import { FlatList, View } from "react-native";

const HashtagScreen = () => {
  const hashtagPost = [
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
      views: 4500,
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
      views: 4870,
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
      views: 8527,
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
      views: 7845,
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
      views: 7454,
    },
    {
      id: "14",
      mediaType: "image",
      mediaUrl:
        "https://cdn.pixabay.com/photo/2025/06/23/17/50/wheat-9676363_960_720.jpg",
      type: "trending",
    },

    {
      id: "15",
      mediaType: "video",
      mediaUrl:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      type: "popular",
      views: 754545,
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

  return (
    <FlatList
      data={hashtagPost}
      numColumns={3}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <GridPostItem item={item} />}
      ListHeaderComponent={<HashtagHeader tag="travel" postCount={2300} />}
      contentContainerStyle={{ backgroundColor: "white" }}
    />
  );
};

export default HashtagScreen;
