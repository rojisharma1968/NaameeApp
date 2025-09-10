import { TouchableOpacity, Image } from 'react-native';

const SocialButton = ({ iconSource, onPress, className = '' }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`
        w-16 h-16 rounded-2xl bg-white 
        items-center justify-center 
        shadow-sm mx-2 
        ${className}
      `}
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
      }}
    >
      <Image
        source={iconSource}
        contentFit='contain'
        style={{ width: 30, height: 30}}
      />
    </TouchableOpacity>
  );
};

export default SocialButton;
