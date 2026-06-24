import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { exercises as catalog } from '../data/exercises';
import { useRoutines } from '../context/RoutinesContext';
import ExerciseCard from '../components/ExerciseCard';

export default function AddExercisesScreen({ route, navigation }) {
  const { routineId, dayId } = route.params;
  const { routines, addExerciseToDay } = useRoutines();
  const [query, setQuery] = useState('');

  const routine = routines.find((r) => r.id === routineId);
  const day = routine?.days.find((d) => d.id === dayId);
  const addedIds = new Set((day?.exercises ?? []).map((e) => e.exerciseId));

  const filtered = catalog.filter((ex) => {
    const q = query.toLowerCase();
    return ex.name.toLowerCase().includes(q) || ex.muscles.toLowerCase().includes(q);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Lista de Ejercicios</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.id}
            name={ex.name}
            muscles={ex.muscles}
            type={ex.type}
            tier={ex.tier}
            added={addedIds.has(ex.id)}
            onAdd={() => addExerciseToDay(routineId, dayId, ex)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  title: { color: colors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 12, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.elevated,
    borderRadius: 12, paddingHorizontal: 12, marginHorizontal: 20, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 12 },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  backBtn: { backgroundColor: colors.coral, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  backText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});