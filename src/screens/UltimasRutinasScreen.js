import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useHistory } from '../context/HistoryContext';

function formatDate(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function normalize(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function UltimasRutinasScreen({ navigation }) {
  const { history, deleteWorkoutRecord } = useHistory();
  const [query, setQuery] = useState('');

  const filtered = history.filter((rec) =>
    normalize(rec.dayName).includes(normalize(query))
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Últimas rutinas</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por día"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {history.length === 0 && (
          <Text style={styles.empty}>Aún no has completado entrenamientos.</Text>
        )}

        {history.length > 0 && filtered.length === 0 && (
          <Text style={styles.empty}>No se encontraron entrenamientos.</Text>
        )}

        {filtered.map((rec) => (
          <TouchableOpacity
            key={rec.id}
            style={[styles.card, { borderLeftColor: rec.dayColor || colors.coral }]}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('WorkoutSummary', {
                minutes: rec.minutes,
                usedSeconds: rec.usedSeconds,
                completed: rec.completed,
                mode: 'history',
              })
            }
            onLongPress={() =>
              Alert.alert('Eliminar registro', `¿Eliminar "${rec.dayName}" del ${formatDate(rec.date)}?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => deleteWorkoutRecord(rec.id) },
              ])
            }
          >
            <Text style={[styles.day, { color: rec.dayColor || colors.coral }]}>{rec.dayName}</Text>
            <Text style={styles.sub}>{rec.routineName} · {formatDate(rec.date)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  title: { color: colors.coral, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 12, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.elevated,
    borderRadius: 12, paddingHorizontal: 12, marginHorizontal: 20, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 12 },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  empty: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 18, marginBottom: 14, borderLeftWidth: 4 },
  day: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  sub: { color: colors.textSecondary, fontSize: 13 },
});