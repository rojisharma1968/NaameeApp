import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import CustomModal from "./CustomModal";

const PrivacyPostHeader = ({ activeTab }) => {
  if (activeTab !== "clicked" && activeTab !== "repeat") {
    return null;
  }

  const [privacySettings, setPrivacySettings] = useState({
    clicked: "onlyme",
    repeat: "onlyme",
  });

  const [modalVisible, setModalVisible] = useState(false);

  const currentPrivacy = privacySettings[activeTab];

  const getVisibilityText = () => {
    if (currentPrivacy === "onlyme") return "Only you can see this page";
    if (currentPrivacy === "everyone") return "Everyone can see this page";
    if (currentPrivacy === "followers") return "Only followers can see this page";
  };

  const options = [
    { value: "onlyme", label: "Only me" },
    { value: "everyone", label: "Everyone" },
    { value: "followers", label: "Followers only" },
  ];

  const handleChange = (value) => {
    setPrivacySettings((prev) => ({ ...prev, [activeTab]: value }));
    setModalVisible(false);
  };

  const modalOptions = options.map((opt) => ({
    title: opt.label,
    textClass: currentPrivacy === opt.value ? "!text-primary !font-bold" : "text-black",
    handle: () => handleChange(opt.value),
  }));

  return (
    <>
      <View className="flex-row justify-between items-center bg-zinc-100 px-4 py-3 mb-1">
        <Text className="text-black">{getVisibilityText()}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-primary text-base font-bold">Change</Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type="post"
        options={modalOptions}
      />
    </>
  );
};

export default PrivacyPostHeader;