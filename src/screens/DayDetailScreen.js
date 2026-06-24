import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useRoutines } from '../context/RoutinesContext';
import ExerciseCard from '../components/ExerciseCard';
import TimerSetupModal from '../components/TimerSetupModal';

function summarize(series) {
  if (!series || series.length === 0) return '0 series';
  const n = series.length;
  const sameReps = series.every((s) => s.reps === series[0].reps);
  const sameWeight = series.every((s) => s.weight === series[0].weight);
  if (sameReps && sameWeight) {
    return `${n} series · ${series[0].reps} reps · ${series[0].weight}kg`;
  }
  return `${n} series`;
}

export default function DayDetailScreen({ route, navigation }) {
  const { routineId, dayId } = route.params;
  const { routines, deleteExerciseFromDay } = useRoutines();

  const routine = routines.find((r) => r.id === routineId);
  const day = routine?.days.find((d) => d.id === dayId);
  const exercises = day?.exercises ?? [];

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [timerVisible, setTimerVisible] = useState(false);

const handleStartWorkout = (minutes) => {
    setTimerVisible(false);
    navigation.navigate('WorkoutActive', { routineId, dayId, minutes });
  };

  const handleEdit = () => {
    const ex = selectedExercise;
    setSelectedExercise(null);
    navigation.navigate('EditExercise', { routineId, dayId, exerciseId: ex.id });
  };

  const handleDelete = () => {
    const ex = selectedExercise;
    setSelectedExercise(null);
    Alert.alert('Eliminar ejercicio', `¿Quitar "${ex.name}" de este día?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteExerciseFromDay(routineId, dayId, ex.id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: day?.color }]} numberOfLines={1}>
          {day?.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Lista de Ejercicios</Text>

        {exercises.length === 0 && (
          <Text style={styles.empty}>Aún no hay ejercicios. Toca "Agregar Ejercicio".</Text>
        )}

        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            name={ex.name}
            muscles={ex.muscles}
            type={ex.type}
            tier={ex.tier}
            setsInfo={summarize(ex.series)}
            onMenuPress={() => setSelectedExercise(ex)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExercises', { routineId, dayId })}
        >
          <Ionicons name="add" size={20} color={colors.coral} />
          <Text style={styles.addButtonText}>Agregar Ejercicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.startButton, exercises.length === 0 && styles.startButtonDisabled]}
          onPress={() => setTimerVisible(true)}
          disabled={exercises.length === 0}
        >
          <Text style={styles.startButtonText}>Iniciar Entrenamiento</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={!!selectedExercise}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedExercise(null)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setSelectedExercise(null)}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle} numberOfLines={1}>{selectedExercise?.name}</Text>

            <TouchableOpacity style={styles.sheetOption} onPress={handleEdit}>
              <Ionicons name="create-outline" size={22} color={colors.text} />
              <Text style={styles.sheetOptionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={22} color={colors.red} />
              <Text style={[styles.sheetOptionText, { color: colors.red }]}>Eliminar</Text>
            </TouchableOpacity>
          </Pressable>
        </TouchableOpacity>
      </Modal>

      <TimerSetupModal
        visible={timerVisible}
        onClose={() => setTimerVisible(false)}
        onStart={handleStartWorkout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  scroll: { padding: 20, paddingBottom: 20 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  empty: { color: colors.textSecondary, fontSize: 14 },
  footer: { padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: colors.border },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: colors.coral, borderRadius: 12, paddingVertical: 14,
  },
  addButtonText: { color: colors.coral, fontSize: 16, fontWeight: 'bold' },
  startButton: { backgroundColor: colors.coral, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  startButtonDisabled: { opacity: 0.4 },
  startButtonText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.elevated, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 32,
  },
  sheetTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 12 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  sheetOptionText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});