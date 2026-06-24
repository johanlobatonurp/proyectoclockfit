import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useRoutines } from '../context/RoutinesContext';

export default function EditExerciseScreen({ route, navigation }) {
  const { routineId, dayId, exerciseId } = route.params;
  const { routines, updateExerciseSeries } = useRoutines();

  const routine = routines.find((r) => r.id === routineId);
  const day = routine?.days.find((d) => d.id === dayId);
  const exercise = day?.exercises.find((e) => e.id === exerciseId);

  const [series, setSeries] = useState(
    (exercise?.series ?? []).map((s) => ({ reps: String(s.reps), weight: String(s.weight) }))
  );

  const updateField = (index, field, value) => {
    const clean = value.replace(/[^0-9]/g, '');
    setSeries((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: clean } : s)));
  };

  const addSerie = () => setSeries((prev) => [...prev, { reps: '10', weight: '0' }]);

  const removeSerie = (index) => {
    if (series.length <= 2) return; // mínimo 2 series
    setSeries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const parsed = series.map((s) => ({
      reps: parseInt(s.reps || '0', 10),
      weight: parseInt(s.weight || '0', 10),
    }));
    updateExerciseSeries(routineId, dayId, exerciseId, parsed);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{exercise?.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>Editar Ejercicio</Text>

        {series.map((s, index) => (
          <View key={index} style={styles.serieRow}>
            <Text style={styles.serieLabel}>Serie {index + 1}</Text>

            <View style={styles.field}>
              <TextInput
                style={styles.input}
                value={s.reps}
                onChangeText={(v) => updateField(index, 'reps', v)}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.unit}>Reps</Text>
            </View>

            <View style={styles.field}>
              <TextInput
                style={styles.input}
                value={s.weight}
                onChangeText={(v) => updateField(index, 'weight', v)}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.unit}>Kgs</Text>
            </View>

            {series.length > 2 && (
              <TouchableOpacity onPress={() => removeSerie(index)} style={styles.removeBtn}>
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addSerieBtn} onPress={addSerie}>
          <Ionicons name="add" size={20} color={colors.coral} />
          <Text style={styles.addSerieText}>Agregar Serie</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar Ejercicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4, marginRight: 8 },
  headerTitle: { color: colors.coral, fontSize: 20, fontWeight: 'bold', flex: 1 },
  scroll: { padding: 20, paddingBottom: 20 },
  subtitle: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  serieRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 12, gap: 10,
  },
  serieLabel: { color: colors.purple, fontSize: 14, fontWeight: 'bold', width: 56 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  input: {
    minWidth: 44, textAlign: 'center', color: colors.text, fontSize: 16, fontWeight: 'bold',
    borderWidth: 1.5, borderColor: colors.coral, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 6,
  },
  unit: { color: colors.text, fontSize: 14, fontWeight: '600' },
  removeBtn: { marginLeft: 'auto', padding: 4 },
  addSerieBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: colors.coral, borderRadius: 12, paddingVertical: 14, marginTop: 4,
  },
  addSerieText: { color: colors.coral, fontSize: 16, fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  saveBtn: { backgroundColor: colors.coral, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});