import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Importar pantallas de autenticación
import SplashScreen from "./android/app/src/screens/auth/SplashScreen"
import LoginScreen from "./android/app/src/screens/auth/LoginScreen"
import RegisterScreen from "./android/app/src/screens/auth/RegisterScreen"
import WelcomeScreen from "./android/app/src/screens/auth/WelcomeScreen"

// Importar pantallas principales
import HomeScreen from "./android/app/src/screens/main/HomeScreen"
import MenuScreen from "./android/app/src/screens/main/MenuScreen"
import AddPaymentMethodScreen from "./android/app/src/screens/main/AddPaymentMethodScreen"
import PaymentSectionScreen from "./android/app/src/screens/main/PaymentSectionScreen"
import SettingsScreen from "./android/app/src/screens/main/SettingsScreen"
import UserInfoScreen from "./android/app/src/screens/main/UserInfoScreen"
import SecurityScreen from "./android/app/src/screens/main/SecurityScreen"
import NotificationsScreen from "./android/app/src/screens/main/NotificationsScreen"
import LoadPaymentMethodScreen from "./android/app/src/screens/main/LoadPaymentMethodScreen"

// Importar pantallas de juegos y loterías
import GamesHomeScreen from "./android/app/src/screens/games/GamesHomeScreen"
import LotteriesListScreen from "./android/app/src/screens/games/LotteriesListScreen"
import BetValueScreen from "./android/app/src/screens/games/BetValueScreen"
import GroupDrawScreen from "./android/app/src/screens/games/GroupDrawScreen"
import GroupDetailScreen from "./android/app/src/screens/games/GroupDetailScreen"
import BetSuccessScreen from "./android/app/src/screens/games/BetSuccessScreen"
import TicketDetailsScreen from "./android/app/src/screens/games/TicketDetailsScreen"

// Importar tipos
import type { RootStackParamList, MainStackParamList, GamesStackParamList } from "./android/app/src/types"

const Stack = createStackNavigator<RootStackParamList>()
const MainStack = createStackNavigator<MainStackParamList>()
const GamesStack = createStackNavigator<GamesStackParamList>()

// Componente para las pantallas de juegos
const GamesStackScreen = () => {
  return (
    <GamesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <GamesStack.Screen name="GamesHome" component={GamesHomeScreen} />
      <GamesStack.Screen name="LotteriesList" component={LotteriesListScreen} />
      <GamesStack.Screen name="BetValue" component={BetValueScreen} />
      <GamesStack.Screen name="GroupDraw" component={GroupDrawScreen} />
      <GamesStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <GamesStack.Screen name="BetSuccess" component={BetSuccessScreen} />
      <GamesStack.Screen name="TicketDetails" component={TicketDetailsScreen} />
    </GamesStack.Navigator>
  )
}

// Componente para las pantallas principales
const MainStackScreen = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Menu" component={MenuScreen} />
      <MainStack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <MainStack.Screen name="PaymentSection" component={PaymentSectionScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="UserInfo" component={UserInfoScreen} />
      <MainStack.Screen name="Security" component={SecurityScreen} />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="LoadPaymentMethod" component={LoadPaymentMethodScreen} />
      <MainStack.Screen name="Games" component={GamesStackScreen} />
    </MainStack.Navigator>
  )
}

// Componente principal de la aplicación
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#033e93" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="MainApp" component={MainStackScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
