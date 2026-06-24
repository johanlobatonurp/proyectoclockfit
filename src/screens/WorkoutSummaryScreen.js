import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { summarizeSeries } from '../utils/format';
import ExerciseCard from '../components/ExerciseCard';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function WorkoutSummaryScreen({ route, navigation }) {
  const { minutes, usedSeconds, completed, mode } = route.params;
  const totalSeconds = minutes * 60;
  const isHistory = mode === 'history';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.completedLabel}>Entrenamiento completado</Text>

        <View style={styles.bigCheck}>
          <Ionicons name="checkmark" size={48} color={colors.text} />
        </View>

        <Text style={styles.timeUsed}>
          Tiempo usado: {formatTime(usedSeconds)} de {formatTime(totalSeconds)}
        </Text>

        <Text style={styles.sectionTitle}>Ejercicios completados</Text>

        {completed.length === 0 && (
          <Text style={styles.empty}>No completaste ningún ejercicio.</Text>
        )}

        {completed.map((ex) => (
          <ExerciseCard
            key={ex.id}
            name={ex.name}
            type={ex.type}
            tier={ex.tier}
            setsInfo={summarizeSeries(ex.series)}
            status="done"
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => (isHistory ? navigation.goBack() : navigation.popToTop())}
        >
          <Text style={styles.homeText}>{isHistory ? 'Volver' : 'Volver al Inicio'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  scroll: { padding: 20, paddingBottom: 20 },
  completedLabel: { color: colors.teal, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 8, marginBottom: 16 },
  bigCheck: {
    width: 110, height: 110, borderRadius: 55, backgroundColor: colors.teal,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16,
  },
  timeUsed: { color: colors.text, fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 28 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  empty: { color: colors.textSecondary, fontSize: 14 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  homeBtn: { backgroundColor: colors.coral, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  homeText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});