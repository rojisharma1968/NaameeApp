import { Image } from "react-native";
import MediaVideo from "./MediaVideo";

const MediaRenderer = ({
  item,
  mediaType,
  uri,
  className = "",
  style = {},
  iconBG
}) => {

  if (mediaType === "video") {
    return (
      <MediaVideo
        iconBG={iconBG}
        uri={uri}
        className={className}
        style={style}
        mediaViews={item}
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      className={className}
      style={style}
      resizeMode="cover"
    />
  );
};

export default MediaRenderer;
