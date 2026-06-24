import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RoutineDetailScreen from '../screens/RoutineDetailScreen';
import DayDetailScreen from '../screens/DayDetailScreen';
import AddExercisesScreen from '../screens/AddExercisesScreen';
import EditExerciseScreen from '../screens/EditExerciseScreen';
import WorkoutActiveScreen from '../screens/WorkoutActiveScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} />
      <Stack.Screen name="AddExercises" component={AddExercisesScreen} />
      <Stack.Screen name="EditExercise" component={EditExerciseScreen} />
      <Stack.Screen name="WorkoutActive" component={WorkoutActiveScreen} />
      <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
    </Stack.Navigator>
  );
}