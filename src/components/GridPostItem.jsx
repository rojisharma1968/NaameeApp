import { Pressable, View } from 'react-native'
import MediaRenderer from './MediaRenderer'
import { useNavigation } from '@react-navigation/native'

const GridPostItem = ({ item, layout = 'grid' }) => {
  const navigation = useNavigation()
  const containerClass =
    layout === 'list' ? 'w-full aspect-square mb-1' : 'w-1/3 aspect-square p-[0.5px]'
  return (
    <Pressable onPress={()=> item.mediaType === 'image' ? navigation.navigate('Posts') : navigation.navigate('Reels')} className={containerClass}>
      <MediaRenderer
        mediaType={item.mediaType}
        uri={item.mediaUrl}
        item={item.views || 0}
        className="w-full h-full"
      />
    </Pressable>
  )
}

export default GridPostItem
