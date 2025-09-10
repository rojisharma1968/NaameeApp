import { useState, useRef, useMemo } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Input from "../components/Input";
import CommentItem from "../components/comments/CommentItem";
import PostCard from "../components/posts/PostCard";
import Avatar from "../components/Avatar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import CustomModal from "../components/CustomModal";

const post = {
  id: "1",
  profileImage: "https://randomuser.me/api/portraits/men/44.jpg",
  username: "johndoe",
  mediaType: "image",
  mediaUrl: "https://images.pexels.com/photos/11750442/pexels-photo-11750442.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1",
  likes: 6525,
  comments: 23,
  repeats: 54,
  caption: "Loving this vibe 🌆 #vibe #mountains #snow",
  time: "3 hours ago",
  mood: "peaceful",
  wearing: "Yoga pants",
  playing: "Guitar",
  listening: "Nature sounds",
  watching: "Clouds",
};

const initialComments = [
  {
    id: "c1",
    username: "alex99",
    text: "@johndoe Amazing shot!",
    time: "2h ago",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "c2",
    username: "lisa_marie",
    text: "Love this view 🏔️",
    time: "1h ago",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
];

const mentionUsers = [
  {
    username: "alex99",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    username: "lisa_marie",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    username: "johndoe",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const CommentsScreen = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [activeComment, setActiveComment] = useState(null);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const { height } = Dimensions.get("window");
  const headerHeight = useHeaderHeight();

  const filteredMentions = useMemo(() => {
    const lastWord = comment.split(" ").pop();
    if (lastWord?.startsWith("@")) {
      const search = lastWord.slice(1).toLowerCase();
      return mentionUsers.filter((u) =>
        u.username.toLowerCase().includes(search)
      );
    }
    return [];
  }, [comment]);

  const handleCommentChange = (text) => setComment(text);

  const handleSelectMention = (username) => {
    const words = comment.split(" ");
    words[words.length - 1] = `@${username}`;
    setComment(words.join(" ") + " ");
  };

  const handlePostComment = () => {
    if (comment.trim()) {
      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "you",
          text: comment,
          time: "just now",
          image: "https://randomuser.me/api/portraits/men/12.jpg",
        },
      ]);
      setComment("");
    }
  };

  const handleReport = (c) => {
    Alert.alert("Reported", `You reported ${c.username}'s comment.`);
    setActiveComment(null);
  };

  const handleCopyUsername = async (c) => {
    await Clipboard.setStringAsync(`@${c.username}`);
    setActiveComment(null);
  };

  const handleDelete = (c) => {
    if (c.username === "you") {
      setComments((prev) => prev.filter((cm) => cm.id !== c.id));
    } else {
      Alert.alert("Not Allowed", "You can only delete your own comments.");
    }
    setActiveComment(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 40}
    >
      <View className="flex-1 position-relative">
        <FlatList
          ref={flatListRef}
          ListHeaderComponent={
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                if (activeComment) setActiveComment(null);
              }}
            >
              <View>
                <PostCard post={post} />
              </View>
            </TouchableWithoutFeedback>
          }
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                if (activeComment && activeComment.id !== item.id)
                  setActiveComment(null);
              }}
            >
              <View>
                <CommentItem
                  comment={item}
                  onPopupToggle={(isOpen) => {
                    if (isOpen) setActiveComment(item);
                    else setActiveComment(null);
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
          contentContainerStyle={{ paddingBottom: 90 }}
          keyboardShouldPersistTaps="always"
        />

        {/* Mentions */}
        {filteredMentions.length > 0 &&
          comment.split(" ").pop().startsWith("@") && (
            <View
              className={`absolute ${
                insets.bottom > 0 ? "bottom-24" : "bottom-20"
              } left-3 right-3 max-h-44 bg-white border border-zinc-200 rounded-xl shadow-md`}
              style={{ zIndex: 50 }}
            >
              <FlatList
                data={filteredMentions}
                keyExtractor={(item) => item.username}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectMention(item.username)}
                    className="flex-row items-center px-4 py-3"
                    activeOpacity={0.7}
                  >
                    <Avatar
                      uri={item.image}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <Text className="text-zinc-800 font-medium text-base">
                      @{item.username}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View className="h-px bg-zinc-100 mx-4" />
                )}
              />
            </View>
          )}

        {/* Input */}
        <SafeAreaView
          edges={["bottom"]}
          className="absolute bg-white flex-1 inset-x-0 bottom-0"
        >
          <View className={`px-3 pt-3 ${insets.bottom > 0 ? "pb-0" : "pb-2"}`}>
            <Input
              value={comment}
              onChangeText={handleCommentChange}
              onSend={handlePostComment}
              placeholder="Write a comment..."
              isCommentInput
              multiline={true}
              minMLHeight={10}
              wrapClass="mb-0"
            />
          </View>
        </SafeAreaView>

        {/* Modal */}
        {activeComment && (
          <CustomModal
            visible={!!activeComment}
            onClose={() => setActiveComment(null)}
            type="post"
            options={[
              {
                title: "Report",
                variant: "textDanger",
                handle: () => handleReport(activeComment),
              },
              {
                title: "Copy Username",
                handle: () => handleCopyUsername(activeComment),
              },
              {
                title: "Delete",
                variant: "textDanger",
                handle: () => handleDelete(activeComment),
              },
              {
                title: "Cancel",
                variant: "textMuted",
                handle: () => setActiveComment(null),
              },
            ]}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentsScreen;
