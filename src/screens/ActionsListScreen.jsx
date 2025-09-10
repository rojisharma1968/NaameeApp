import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { View, Text, Keyboard } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Input from "../components/Input";
import ResultCard from "../components/ResultCard";

const dummyUsers = [
  {
    id: "u1",
    name: "Amit Sharma",
    username: "@amitsharma45",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isFollowing: true,
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

const ActionsListsScreen = ({ navigation, route }) => {
  const actionName = route.params?.action;
  const heading = actionName === "smile" ? "Smiles By" : "Repeats By";

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(dummyUsers);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      bottomSheetModalRef.current?.snapToIndex(0);
    }, 100);
  }, []);

  const handleSheetChange = useCallback(
    (index) => {
      if (index < 0) {
        Keyboard.dismiss();
        navigation.goBack();
      }
    },
    [navigation]
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const renderHandle = useCallback(
    () => (
      <View className="self-center w-10 h-1.5 bg-gray-300 rounded-full mt-2 mb-3" />
    ),
    []
  );

  const handleClear = () => setQuery("");

  const toggleFollow = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isFollowing: !u.isFollowing } : u))
    );
  };

  const results = users.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(query.toLowerCase())) ||
      (item.username &&
        item.username.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 bg-transparent">
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          backdropComponent={renderBackdrop}
          handleComponent={renderHandle}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
        >
          <View className="flex-1 bg-white px-4">
            <Text className="text-lg font-bold text-center mb-5">
              {heading}
            </Text>
            <View className="relative mb-3">
              <Input
                value={query}
                onChangeText={setQuery}
                placeholder="Search users"
                icon="search"
                wrapClass="mb-0"
                autoCorrect={false}
                isSearchInput={true}
                onClear={handleClear}
              />
            </View>

            {/* Results */}
            <BottomSheetFlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text className="text-center text-gray-500 mt-12 text-base">
                  No results found
                </Text>
              }
              renderItem={({ item }) => (
                <ResultCard
                  item={item}
                  onFollowToggle={toggleFollow}
                  onPress={() => navigation.replace("UsersProfile")}
                />
              )}
            />
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default ActionsListsScreen;
