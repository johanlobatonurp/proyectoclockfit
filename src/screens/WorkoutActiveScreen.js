import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { useRoutines } from '../context/RoutinesContext';
import { useHistory } from '../context/HistoryContext';
import { summarizeSeries } from '../utils/format';
import RestModal from '../components/RestModal';
import ExerciseCard from '../components/ExerciseCard';

const REST_SECONDS = 120; 

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function WorkoutActiveScreen({ route, navigation }) {
  const { routineId, dayId, minutes } = route.params;
  const { routines } = useRoutines();
  const { addWorkoutRecord } = useHistory();
  const [resting, setResting] = useState(false);

  const routine = routines.find((r) => r.id === routineId);
  const day = routine?.days.find((d) => d.id === dayId);
  const exercises = day?.exercises ?? [];

  const totalSeconds = minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
  const fractionLeft = remaining / totalSeconds;

  let barColor = colors.teal;
  let statusLabel = 'En ritmo';
  if (remaining === 0) {
    barColor = colors.red;
    statusLabel = 'Tiempo agotado';
  } else if (fractionLeft <= 0.25) {
    barColor = colors.amber;
    statusLabel = 'Apúrate';
  }

 const finishExercise = () => setResting(true);

  const handleRestDone = () => {
    setResting(false);
    setActiveIndex((prev) => prev + 1);
  };

  const endWorkout = () => {
    Alert.alert('Terminar entrenamiento', '¿Seguro que quieres terminar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Terminar',
        style: 'destructive',
        onPress: () => {
          const usedSeconds = totalSeconds - remaining;
          const completed = exercises.slice(0, activeIndex);
          addWorkoutRecord({
            id: Date.now().toString(),
            dayName: day?.name,
            dayColor: day?.color,
            routineName: routine?.name,
            date: new Date().toISOString(),
            minutes,
            usedSeconds,
            completed,
          });
          navigation.navigate('WorkoutSummary', { minutes, usedSeconds, completed });
        },
      },
    ]);
  };

  const allDone = exercises.length > 0 && activeIndex >= exercises.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.timerLabel}>Tiempo Restante</Text>
        <Text style={styles.timer}>{formatTime(remaining)}</Text>

        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${progress * 100}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={[styles.statusLabel, { color: barColor }]}>{statusLabel}</Text>

        {exercises.map((ex, index) => {
          let status = 'pending';
          if (index < activeIndex) status = 'done';
          else if (index === activeIndex) status = 'active';
          return (
            <ExerciseCard
              key={ex.id}
              name={ex.name}
              type={ex.type}
              tier={ex.tier}
              setsInfo={summarizeSeries(ex.series)}
              status={status}
              onFinish={finishExercise}
            />
          );
        })}

        {allDone && <Text style={styles.allDone}>¡Completaste todos los ejercicios!</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.endBtn} onPress={endWorkout}>
          <Text style={styles.endText}>Terminar Entrenamiento</Text>
        </TouchableOpacity>
      </View>

      <RestModal visible={resting} seconds={REST_SECONDS} onDone={handleRestDone} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  scroll: { padding: 20, paddingBottom: 20 },
  timerLabel: { color: colors.text, fontSize: 18, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  timer: {
    color: colors.text, fontSize: 56, fontWeight: 'bold', textAlign: 'center',
    fontVariant: ['tabular-nums'], marginBottom: 20,
  },
  barTrack: { height: 10, borderRadius: 5, backgroundColor: colors.elevated, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  statusLabel: { fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 24 },
  allDone: { color: colors.teal, fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  endBtn: { backgroundColor: colors.coral, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  endText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});