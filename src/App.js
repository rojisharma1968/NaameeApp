import '../global.css'
import { NavigationContainer } from '@react-navigation/native'
import Route from './navigation/Route'
import { UserProvider } from './context/userContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <NavigationContainer>
          <Route />
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  )
}

export default App  