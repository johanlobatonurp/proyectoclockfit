import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { RoutinesProvider } from './src/context/RoutinesContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { HistoryProvider } from './src/context/HistoryContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RoutinesProvider>
          <ProfileProvider>
            <HistoryProvider>
              <NavigationContainer>
                <StatusBar style="light" />
                <RootNavigator />
              </NavigationContainer>
            </HistoryProvider>
          </ProfileProvider>
        </RoutinesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}