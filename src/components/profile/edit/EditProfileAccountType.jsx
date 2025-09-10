import { View } from "react-native";
import ToggleSelector from "../../ToggleSelector";
import { Text } from "react-native";
import { memo, useMemo } from "react";

const EditProfileAccountType = memo(({ accountType, setAccountType }) => {
  const toggleOptions = useMemo(() => [
    { label: "Public", value: "Public", icon: "globe" },
    { label: "Private", value: "Private", icon: "lock" },
  ], []);

  return (
    <View className="bg-white rounded-xl p-6 mb-6">
      <Text className="text-xl font-semibold text-gray-900 mb-5">Account Type</Text>
      <ToggleSelector
        value={accountType}
        onChange={setAccountType}
        options={toggleOptions}
      />
    </View>
  );
});

export default EditProfileAccountType