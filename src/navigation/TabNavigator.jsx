import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ExploreScreen from "../screens/ExploreScreen";
import CameraScreen from "../screens/CameraScreen";
import { useUser } from "../context/userContext";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = insets.bottom > 0 ? 80 : 65;
  const { logout } = useUser();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "#5ba1d6",
          fontWeight: 700,
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: tabBarHeight,
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#ddd",
        },
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.navigate("Camera")}
            className="ml-3"
          >
            <View className="size-10 items-center justify-center">
              <Feather name="camera" size={26} color="black" />
            </View>
          </Pressable>
        ),

        headerRight: () =>
          route.name === "Profile" ? (
            <Pressable onPress={logout} className="mr-3">
              <View className="size-10 bg-danger/20 rounded-full items-center justify-center">
                <Feather name="log-out" size={22} color="#b91c1c" />
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("Search")}
              className="mr-3"
            >
              <View className="size-10 items-center justify-center">
                <Feather name="search" size={26} color="black" />
              </View>
            </Pressable>
          ),
        tabBarIcon: ({ focused }) => {
          const icons = {
            Home: "home",
            Profile: "user",
            Notifications: "bell",
            Explore: "compass",
            Camera: "camera",
          };
          const iconName = icons[route.name];

          if (focused) {
            return (
              <View className="size-12 rounded-full bg-primary/30 items-center justify-center">
                <Feather name={iconName} size={27} color="#5ba1d6" />
              </View>
            );
          }

          return (
            <View className="size-12 rounded-full bg-transparent items-center justify-center">
              <Feather name={iconName} size={27} color="#000" />
            </View>
          );
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          paddingTop: insets.bottom > 0 ? 9 : 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ title: "Naamee" }}
        component={HomeScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Home", { scrollToTop: Date.now() });
          },
        })}
      />
      <Tab.Screen
        name="Explore"
        options={{ title: "Explore Posts" }}
        component={ExploreScreen}
      />
      <Tab.Screen
        name="Camera"
        options={{ headerShown: false }}
        component={CameraScreen}
      />
      <Tab.Screen
        name="Notifications"
        options={{ title: "Your Notification" }}
        component={NotificationsScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{ title: "Your Profile" }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
