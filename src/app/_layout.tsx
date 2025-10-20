import { KeyboardProvider } from "react-native-keyboard-controller";
import 'react-native-reanimated';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AccountsProvider } from '@/contexts/accounts.context';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <AccountsProvider>
            <Stack
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  animation: 'none'
                }}
              />
              <Stack.Screen
                name="account-form"
                options={{
                  animation: 'ios_from_right',
                  animationDuration: 200,
                }}
              />
              <Stack.Screen
                name="account-detail"
                options={{
                  animation: 'ios_from_right',
                  animationDuration: 200,
                }}
              />
            </Stack>

          </AccountsProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
