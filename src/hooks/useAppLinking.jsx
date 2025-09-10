import { Linking } from "react-native";

const useAppLinking = () => {
  const openAppFirst = async (webUrl, appUrl) => {
    try {
      await Linking.openURL(appUrl);
    } catch (error) {
      await Linking.openURL(webUrl);
    }
  };

  return { openAppFirst };
};

export default useAppLinking;
