import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import Avatar from "../../Avatar";
import { memo } from "react";

const EditProfileBanner = memo(({ bannerImage, profileImage, pickBanner, pickImage }) => (
  <View className="mb-6">
    <TouchableOpacity onPress={pickBanner}>
      <ImageBackground
        source={{ uri: bannerImage }}
        className="w-full h-24 rounded-xl overflow-hidden justify-end items-center"
        resizeMode="cover"
      >
        <View className="absolute top-2 right-2 bg-black/40 px-3 py-1 rounded-md">
          <Text className="text-white text-sm font-medium">Edit Banner</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
    <View className="items-center -mt-16">
      <TouchableOpacity onPress={pickImage} className="relative">
        <Avatar
          uri={
            profileImage ||
            "https://randomuser.me/api/portraits/women/81.jpg"
          }
          className="w-32 h-32 rounded-full border-4 border-white"
        />
        <View className="absolute bottom-1 right-1 bg-primary rounded-full p-2.5">
          <Text className="text-sm text-white font-semibold">Edit</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
));


export default EditProfileBanner