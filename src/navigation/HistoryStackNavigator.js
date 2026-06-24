import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UltimasRutinasScreen from '../screens/UltimasRutinasScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';

const Stack = createNativeStackNavigator();

export default function HistoryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UltimasRutinas" component={UltimasRutinasScreen} />
      <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
    </Stack.Navigator>
  );
}