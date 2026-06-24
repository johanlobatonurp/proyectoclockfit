import React from 'react';
import { useAuth } from '../context/AuthContext';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen';

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <BottomTabNavigator /> : <LoginScreen />;
}