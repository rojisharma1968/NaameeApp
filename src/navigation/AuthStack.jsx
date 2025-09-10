import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authscreens/LoginScreen";
import RegisterScreen from "../screens/authscreens/RegisterScreen";
import ForgotPassScreen from "../screens/authscreens/ForgotPassScreen";
import NewPassScreen from "../screens/authscreens/NewPassScreen";


const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown:false,
      animation:'slide_from_right'
    }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassScreen} />
      <Stack.Screen name="NewPassword" component={NewPassScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
