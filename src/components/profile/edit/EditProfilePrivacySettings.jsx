import { memo, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons"; // Import Feather icons

const EditProfilePrivacySettings = memo(
  ({
    privacySettings,
    openPrivacyKey,
    handlePrivacyChange,
    togglePrivacyDropdown,
  }) => {
    const PRIVACY_OPTIONS = useMemo(
      () => [
        { label: "Only Me", icon: "lock" },
        { label: "Everyone", icon: "globe" },
        { label: "Followers Only", icon: "users" },
      ],
      []
    );

    const getLabel = (key) => {
      switch (key) {
        case "followers":
          return "Who can see your followers";
        case "following":
          return "Who can see who you follow";
        case "videos":
          return "Who can see your video views";
        default:
          return `Who can see your ${key}`;
      }
    };

    return (
      <View className="bg-white rounded-xl px-6 pt-6 mb-6">
        <Text className="text-xl font-semibold text-gray-900 mb-5">
          Privacy Settings
        </Text>
        {Object.keys(privacySettings).map((key, index) => (
          <View
            key={key}
            className={`mb-5 ${
              index === Object.keys(privacySettings).length - 1
                ? ""
                : "border-b border-gray-200"
            } pb-5`}
          >
            <TouchableOpacity
              onPress={() => togglePrivacyDropdown(key)}
              className="flex-row justify-between items-center"
            >
              <View>
                <Text className="text-sm text-gray-600">{getLabel(key)}</Text>
                <View className="flex-row items-center mt-1">
                  <Feather
                    name={
                      privacySettings[key] === "Only Me"
                        ? "lock"
                        : privacySettings[key] === "Everyone"
                          ? "globe"
                          : "users"
                    }
                    size={18}
                    color="#4B5563"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-lg text-gray-800 font-medium">
                    {privacySettings[key]}
                  </Text>
                </View>
              </View>

              <Text className="text-primary text-base font-medium">Change</Text>
            </TouchableOpacity>

            {openPrivacyKey === key && (
              <View className="mt-4 bg-gray-100 rounded-lg p-4">
                {PRIVACY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    onPress={() => handlePrivacyChange(key, option.label)}
                    className="py-3 flex-row items-center"
                  >
                    <Feather
                      name={option.icon}
                      size={20}
                      color={
                        privacySettings[key] === option.label
                          ? "#5ba1d6" // selected icon color
                          : "#4B5563" // gray
                      }
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      className={`text-base font-medium ${
                        privacySettings[key] === option.label
                          ? "text-primary font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }
);

export default EditProfilePrivacySettings;
