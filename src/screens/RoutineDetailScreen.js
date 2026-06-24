import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, dayColors } from '../constants/colors';
import { useRoutines } from '../context/RoutinesContext';
import DayCard from '../components/DayCard';
import AddDayModal from '../components/AddDayModal';



export default function RoutineDetailScreen({ route, navigation }) {
  const { routineId } = route.params;
  const { routines, addDay, editDay, deleteDay } = useRoutines();
  const routine = routines.find((r) => r.id === routineId);

  const [addVisible, setAddVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingDay, setEditingDay] = useState(null);

  const nextColor = dayColors[(routine?.days.length ?? 0) % dayColors.length];
  const MAX_DAYS = 6;
  
  const handleEdit = () => {
    const d = selectedDay;
    setSelectedDay(null);
    setTimeout(() => setEditingDay(d), 250);
  };

  const handleDelete = () => {
    const d = selectedDay;
    setSelectedDay(null);
    Alert.alert('Eliminar día', `¿Eliminar "${d.name}" y sus ejercicios?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteDay(routineId, d.id) },
    ]);
  };

  const handleAddDayPress = () => {
    if ((routine?.days.length ?? 0) >= MAX_DAYS) {
      Alert.alert(
        'Límite de días',
        `Solo puedes tener ${MAX_DAYS} días por rutina. Modifica o elimina uno para crear uno nuevo.`
      );
      return;
    }
    setAddVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{routine?.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Días de entrenamiento</Text>

        {routine?.days.length === 0 && (
          <Text style={styles.empty}>Aún no has agregado días. Toca "Agregar día" para empezar.</Text>
        )}

        {routine?.days.map((day) => (
          <DayCard
            key={day.id}
            name={day.name}
            description={day.description}
            exerciseCount={day.exercises.length}
            color={day.color}
            onPress={() => navigation.navigate('DayDetail', { routineId, dayId: day.id })}
            onMenuPress={() => setSelectedDay(day)}
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddDayPress}>
          <Ionicons name="add" size={20} color={colors.coral} />
          <Text style={styles.addButtonText}>Agregar día</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddDayModal
        visible={addVisible}
        title="Agregar Día"
        submitLabel="Agregar"
        defaultColor={nextColor}
        onClose={() => setAddVisible(false)}
        onSubmit={(name, description, color) => {
          addDay(routineId, name, description, color);
          setAddVisible(false);
        }}
      />

      <AddDayModal
        visible={!!editingDay}
        title="Editar Día"
        submitLabel="Guardar"
        initialName={editingDay?.name}
        initialDescription={editingDay?.description}
        defaultColor={editingDay?.color}
        onClose={() => setEditingDay(null)}
        onSubmit={(name, description, color) => {
          editDay(routineId, editingDay.id, name, description, color);
          setEditingDay(null);
        }}
      />

      <Modal
        visible={!!selectedDay}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDay(null)}
      >
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setSelectedDay(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle} numberOfLines={1}>{selectedDay?.name}</Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4, marginRight: 8 },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold', flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: { color: colors.coral, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  empty: { color: colors.textSecondary, fontSize: 14, marginBottom: 16 },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: colors.coral, borderRadius: 12, paddingVertical: 14, marginTop: 4,
  },
  addButtonText: { color: colors.coral, fontSize: 16, fontWeight: 'bold' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.elevated, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 32,
  },
  sheetTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 12 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  sheetOptionText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});