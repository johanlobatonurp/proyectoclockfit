import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { exercises } from '../data/exercises';
import ExerciseCard from '../components/ExerciseCard';

export default function ExercisesScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = exercises.filter((ex) => {
    const q = query.toLowerCase();
    return ex.name.toLowerCase().includes(q) || ex.muscles.toLowerCase().includes(q);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ejercicios Disponibles</Text>
      </View>

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
          />
        ))}

        {filtered.length === 0 && (
          <Text style={styles.empty}>No se encontraron ejercicios.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4, marginRight: 8 },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold', flex: 1 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.elevated,
    borderRadius: 12, paddingHorizontal: 12, marginHorizontal: 20, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 12 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 20 },
});