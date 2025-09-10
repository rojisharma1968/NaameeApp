import { useCallback, useEffect, useState, useRef, memo, useMemo } from "react";
import {
  Animated,
  Text,
  View,
  TouchableWithoutFeedback,
  Switch,
  ScrollView,
  Keyboard,
  Alert,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import EditProfileBanner from "../components/profile/edit/EditProfileBanner";
import EditProfilePersonalInfo from "../components/profile/edit/EditProfilePersonalInfo";
import EditProfileAccountType from "../components/profile/edit/EditProfileAccountType";
import EditProfilePrivacySettings from "../components/profile/edit/EditProfilePrivacySettings";
import Button from "../components/Button";

const { width: screenWidth } = Dimensions.get("window");

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80"
  );
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    phone: "",
    website: "",
    bio: "",
  });
  const [accountType, setAccountType] = useState("Public");
  const [notifications, setNotifications] = useState(true);
  const [privacySettings, setPrivacySettings] = useState({
    followers: "Everyone",
    following: "Everyone",
    videos: "Everyone",
  });
  const [openPrivacyKey, setOpenPrivacyKey] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: accountType === "Public" ? 0 : 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [accountType]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          const croppedUri = await AsyncStorage.getItem("croppedUri");
          const typ = await AsyncStorage.getItem("type");
          if (croppedUri && typ) {
            if (typ === "profile") {
              setProfileImage(croppedUri);
            } else if (typ === "banner") {
              setBannerImage(croppedUri);
            }
            await AsyncStorage.removeItem("croppedUri");
            await AsyncStorage.removeItem("type");
          }
        } catch (error) {
          console.error("Error reading from AsyncStorage:", error);
        }
      }

      fetchData();
    }, [])
  );

  const pickImage = useCallback(() => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Gallery",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission Denied",
                "You need to allow media library access to select an image."
              );
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: false,
              quality: 0.8,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              navigation.navigate("CropScreen", {
                imageUri: uri,
                cropDimensions: { width: 120, height: 120 },
                type: "profile",
              });
            }
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission Denied",
                "You need to allow camera access to take a photo."
              );
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: 'images',
              allowsEditing: false,
              quality: 0.8,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              navigation.navigate("CropScreen", {
                imageUri: uri,
                cropDimensions: { width: 120, height: 120 },
                type: "profile",
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [navigation]);

  const pickBanner = useCallback(() => {
    Alert.alert(
      "Select Banner",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Gallery",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission Denied",
                "You need to allow media library access to select a banner."
              );
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: false,
              quality: 0.8,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              navigation.navigate("CropScreen", {
                imageUri: uri,
                cropDimensions: { width: screenWidth, height: 55 },
                type: "banner",
              });
            }
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission Denied",
                "You need to allow camera access to take a banner photo."
              );
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: 'images',
              allowsEditing: false,
              quality: 0.8,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              navigation.navigate("CropScreen", {
                imageUri: uri,
                cropDimensions: { width: screenWidth, height: 55 },
                type: "banner",
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [navigation]);

  const handlePrivacyChange = useCallback((key, value) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }));
    setOpenPrivacyKey("");
  }, []);

  const togglePrivacyDropdown = useCallback((key) => {
    setOpenPrivacyKey((prev) => (prev === key ? "" : key));
  }, []);

  const handleProfileChange = useCallback((key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const inputFields = useMemo(
    () => [
      {
        label: "Full Name",
        value: profileData.name,
        onChangeText: (value) => handleProfileChange("name", value),
        placeholder: "Enter your full name",
        icon: "user",
      },
      {
        label: "Username",
        value: profileData.username,
        onChangeText: (value) => handleProfileChange("username", value),
        placeholder: "Enter your username",
        icon: "at-sign",
      },
      {
        label: "Email",
        value: profileData.email,
        onChangeText: (value) => handleProfileChange("email", value),
        placeholder: "Enter your email",
        icon: "mail",
      },
      {
        label: "Phone",
        value: profileData.phone,
        onChangeText: (value) => handleProfileChange("phone", value),
        placeholder: "Enter your phone number",
        icon: "phone",
      },
      {
        label: "Website",
        value: profileData.website,
        onChangeText: (value) => handleProfileChange("website", value),
        placeholder: "Enter your website",
        icon: "globe",
      },
      {
        label: "Bio",
        value: profileData.bio,
        onChangeText: (value) => handleProfileChange("bio", value),
        placeholder: "Tell us about yourself",
        multiline: true,
      },
    ],
    [profileData, handleProfileChange]
  );

  return (
    <View className="flex-1 bg-zinc-100">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="px-3 py-5">
          <EditProfileBanner
            bannerImage={bannerImage}
            profileImage={profileImage}
            pickBanner={pickBanner}
            pickImage={pickImage}
          />

          <EditProfilePersonalInfo inputFields={inputFields} />

          <EditProfileAccountType
            accountType={accountType}
            setAccountType={setAccountType}
          />

          <EditProfilePrivacySettings
            privacySettings={privacySettings}
            openPrivacyKey={openPrivacyKey}
            handlePrivacyChange={handlePrivacyChange}
            togglePrivacyDropdown={togglePrivacyDropdown}
          />

          <View className="bg-white rounded-xl p-6 mb-6 flex-row items-center justify-between">
            <Text className="text-lg text-gray-800 font-medium">
              Notifications
            </Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#d1d5db", true: "#5ba1d6" }}
              thumbColor={notifications ? "#ffffff" : "#f4f4f5"}
            />
          </View>

          <Text className="mb-4 text-base text-center">
            <Text
              className="text-primary text-base"
              onPress={() => navigation.navigate("TermsScreen")}
            >
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text
              className="text-primary text-base"
              onPress={() => navigation.navigate("PrivacyScreen")}
            >
              Privacy Policy
            </Text>
          </Text>
          <Button title="Save Changes" className="mb-8" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default memo(EditProfileScreen);
