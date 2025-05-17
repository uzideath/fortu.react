import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Importar provider de autenticación
import { AuthProvider } from "./src/hooks/useAuth"

// Importar pantallas de autenticación
import SplashScreen from "./src/screens/auth/SplashScreen"
import LoginScreen from "./src/screens/auth/LoginScreen"
import RegisterScreen from "./src/screens/auth/RegisterScreen"
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen"

// Importar pantallas principales
import HomeScreen from "./src/screens/main/HomeScreen"
import AddPaymentMethodScreen from "./src/screens/main/AddPaymentMethodScreen"
import MenuScreen from "./src/screens/main/MenuScreen"
import MovementsDetailScreen from "./src/screens/main/MovementsDetailScreen"
import StatisticsScreen from "./src/screens/main/StatisticsScreen"

// Importar pantallas de configuración
import UserInfoScreen from "./src/screens/settings/UserInfoScreen"
import SecurityScreen from "./src/screens/settings/SecurityScreen"
import SettingsScreen from "./src/screens/settings/SettingsScreen"
import NotificationsScreen from "./src/screens/settings/NotificationsScreen"

// Importar pantallas de juegos
import GamesHomeScreen from "./src/screens/games/GamesHomeScreen"
import LotteriesListScreen from "./src/screens/games/LotteriesListScreen"
import GamesList from "./src/screens/games/GamesList"
import GroupDrawScreen from "./src/screens/games/GroupDrawScreen"

// Importar tipos
import type { RootStackParamList, MainStackParamList, GamesStackParamList } from "./src/types"
import { navigationRef } from "@/lib/navigation"

const Stack = createStackNavigator<RootStackParamList>()
const MainStack = createStackNavigator<MainStackParamList>()
const GamesStack = createStackNavigator<GamesStackParamList>()

const GamesNavigator = () => {
  return (
    <GamesStack.Navigator initialRouteName="GamesHome" screenOptions={{ headerShown: false }}>
      <GamesStack.Screen name="GamesHome" component={GamesHomeScreen} />
      <GamesStack.Screen name="LotteriesList" component={LotteriesListScreen} />
      <GamesStack.Screen name="GamesList" component={GamesList} />
      <GamesStack.Screen name="GroupDraw" component={GroupDrawScreen} />
    </GamesStack.Navigator>
  )
}

const MainAppNavigator = () => {
  return (
    <MainStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Menu" component={MenuScreen} />
      <MainStack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="UserInfo" component={UserInfoScreen} />
      <MainStack.Screen name="Security" component={SecurityScreen} />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="Movements" component={MovementsDetailScreen} />
      <MainStack.Screen name="Statistics" component={StatisticsScreen} />
      <MainStack.Screen name="Games" component={GamesNavigator} />
    </MainStack.Navigator>
  )
}

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar barStyle="light-content" backgroundColor="#033e93" />
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="MainApp" component={MainAppNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

export default App
