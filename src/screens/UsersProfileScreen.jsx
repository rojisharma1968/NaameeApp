import { FlatList, View, Text } from "react-native";
import ProfileHeader from "../components/profile/ProfileHeader";
import Tabs from "../components/Tabs";
import GridPostItem from "../components/GridPostItem";
import { useState } from "react";

const demoPosts = [];

const UsersProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("grid");

  const filteredPosts =
    activeTab === "repeat" ? demoPosts.filter((p) => p.repeats > 0) : demoPosts;

  return (
    <FlatList
      className="flex-1 bg-white"
      key={activeTab}
      data={filteredPosts}
      keyExtractor={(item) => item.id}
      numColumns={activeTab === "list" ? 1 : 3}
      renderItem={({ item }) => (
        <GridPostItem item={item} layout={activeTab} />
      )}
      ListHeaderComponent={
        <>
          <ProfileHeader
            avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
            totalPosts={demoPosts.length}
            user="other"
          />

          <Tabs
            wrapClass="bg-zinc-100"
            tabs={[
              { key: "grid", icon: "grid" },
              { key: "list", icon: "list" },
              { key: "repeat", icon: "repeat" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            useIcons
          />
        </>
      }
      ListEmptyComponent={
        <View className="items-center mt-16">
          <Text className="text-gray-500 text-base">No posts from this user yet</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

export default UsersProfileScreen;
