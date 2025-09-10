import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";
import React from "react";
import PostCounts from "./posts/PostCounts";

const thumbCache = {};

const getSafeFileName = (uri) => {
  const lastPart = uri.split("/").pop() || "video";
  return lastPart.replace(/\W+/g, "_") + ".jpg";
};

const getVideoThumbnail = async (videoUri, iconBG) => {
  const filename = getSafeFileName(videoUri);
  const fileUri = FileSystem.cacheDirectory + filename;

  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    return fileUri;
  }

  try {
    const { uri: generatedUri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: 1000,
      }
    );

    await FileSystem.copyAsync({
      from: generatedUri,
      to: fileUri,
    });

    return fileUri;
  } catch (e) {
    console.warn("Thumbnail generation failed", e);
    return null;
  }
};

const MediaVideo = ({
  uri,
  mediaViews,
  className = "",
  style = {},
  iconBG,
}) => {
  const [thumb, setThumb] = useState(() => thumbCache[uri] || null);
  const [loading, setLoading] = useState(() => !thumbCache[uri]);

  useEffect(() => {
    let isMounted = true;

    const loadThumb = async () => {
      if (thumbCache[uri]) return;

      const thumbUri = await getVideoThumbnail(uri);
      if (isMounted && thumbUri) {
        thumbCache[uri] = thumbUri;
        setThumb(thumbUri);
        setLoading(false);
      } else if (isMounted) {
        setLoading(false);
      }
    };

    loadThumb();

    return () => {
      isMounted = false;
    };
  }, [uri]);

  if (loading) {
    return (
      <View
        className={`bg-gray-200 justify-center items-center ${className}`}
        style={style}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className={`relative ${className}`} style={style}>
      <Image
        source={{ uri: thumb }}
        className="w-full h-full"
        resizeMode="cover"
      />
      {mediaViews > 0 && (
        <PostCounts
          iconSize={14}
          textClass="text-xs"
          mediaViews={mediaViews}
        />
      )}
      <View
        className={`absolute top-2 right-2 ${iconBG || "bg-transparent"}  p-1 rounded-full`}
      >
        <Feather name="video" size={14} color="white" />
      </View>
    </View>
  );
};

export default React.memo(MediaVideo);
