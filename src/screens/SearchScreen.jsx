import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import ResultCard from "../components/ResultCard";

// Dummy user and post data
const dummyUsers = [
  {
    id: "u1",
    name: "Amit Sharma",
    username: "@amitsharma45",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isFollowing: false,
    type: "user",
  },
  {
    id: "u2",
    name: "Neha Verma",
    username: "@nehaverma754",
    avatar: "https://randomuser.me/api/portraits/women/52.jpg",
    isFollowing: true,
    type: "user",
  },
];

const dummyPosts = [
  {
    id: "p1",
    hashtag: "#enjoy",
    type: "post",
    count: 100,
  },
  {
    id: "p2",
    hashtag: "#travel",
    type: "post",
    count: 150,
  },
  {
    id: "p3",
    hashtag: "#elonmusk",
    type: "post",
    count: 90,
  },
];

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(dummyUsers);
  const [posts] = useState(dummyPosts);

  const handleClear = () => setQuery("");

  const toggleFollow = (id) => {
    setUsers((prev) => {
      const newUsers = prev.map((u) =>
        u.id === id ? { ...u, isFollowing: !u.isFollowing } : u
      );
      return newUsers;
    });
  };

  const results = [...users, ...posts].filter((item) => {
    if (item.type === "user") {
      return (
        (item.name && item.name.toLowerCase().includes(query.toLowerCase())) ||
        (item.username &&
          item.username.toLowerCase().includes(query.toLowerCase()))
      );
    } else if (item.type === "post") {
      return (
        item.hashtag && item.hashtag.toLowerCase().includes(query.toLowerCase())
      );
    }
    return false;
  });

  return (
    <View className="flex-1 bg-white px-4 pt-3">
      {/* Search Input */}
      <View className="relative mb-3">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search users or #tags"
          icon="search"
          wrapClass='mb-0'
          autoCorrect={false}
          isSearchInput={true}
          onClear={handleClear}
        />
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-12 text-base">
            No results found
          </Text>
        }
        renderItem={({ item }) => {
          return (
            <ResultCard
              item={item}
              onFollowToggle={toggleFollow}
              onPress={() =>
                item.type === "user"
                  ? navigation.navigate("UsersProfile")
                  : navigation.navigate("HashTags")
              }
            />
          );
        }}
      />
    </View>
  );
};

export default SearchScreen;
