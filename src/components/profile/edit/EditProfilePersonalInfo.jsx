import { Text, View } from "react-native";
import { memo, useState } from "react";
import Button from "../../Button";
import Input from "../../Input";
import CustomModal from "../../CustomModal";

const EditProfilePersonalInfo = memo(({ inputFields }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <View className="bg-white rounded-xl p-6 mb-6">
      <Text className="text-xl font-semibold text-gray-900 mb-5">
        Personal Info
      </Text>
      <View className="space-y-5">
        {inputFields.map((field, index) => (
          <Input
            key={index}
            label={field.label}
            value={field.value}
            onChangeText={field.onChangeText}
            placeholder={field.placeholder}
            multiline={field.multiline || false}
            icon={field.icon}
            highlightMentions= {field.multiline || false}
            minMLHeight={120}
          />
        ))}
        <Button
          variant="secondary"
          className="mt-3 !py-4"
          textClass="text-base"
          title="Change Password"
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Change Password Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type="password"
        title="Change Password"
        newPassword={newPassword}
        onChangeNewPassword={setNewPassword}
        confirmNewPassword={confirmNewPassword}
        onChangeConfirmNewPassword={setConfirmNewPassword}
        onSubmit={() => {
          console.log("Password changed");
        }}
      />
    </View>
  );
});

export default EditProfilePersonalInfo;
