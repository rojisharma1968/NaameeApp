import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Tabs = ({ tabs = [], activeTab, onChange, useIcons = false, wrapClass = '' }) => {
  const handlePress = useCallback(
    (key) => () => onChange(key),
    [onChange]
  );

  return (
    <View className={`flex-row justify-around py-2 ${wrapClass}`}>
      {tabs.map(({ key, icon, label }) => {
        const isActive = activeTab === key;
        const activeStyle = isActive ? 'bg-primary/30' : 'bg-transparent';
        const textStyle = isActive ? 'text-primary font-bold' : 'text-gray-400';

        return (
          <TouchableOpacity
            key={key}
            onPress={handlePress(key)}
            className={`py-2 px-3 rounded-md ${activeStyle}`}
          >
            {useIcons && icon ? (
              <Feather
                name={icon}
                size={24}
                color={isActive ? '#5ba1d6' : 'gray'}
              />
            ) : (
              <Text className={`capitalize ${textStyle}`}>
                {label || key}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(Tabs);
