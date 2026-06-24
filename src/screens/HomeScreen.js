import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Alert, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useRoutines } from '../context/RoutinesContext';
import RoutineCard from '../components/RoutineCard';
import CreateRoutineModal from '../components/CreateRoutineModal';

const userName = 'Usuario';
const MAX_ROUTINES = 3;

export default function HomeScreen({ navigation }) {
  const { routines, addRoutine, editRoutine, deleteRoutine } = useRoutines();
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [editingRoutine, setEditingRoutine] = useState(null);   

  const handleEdit = () => {
    const r = selectedRoutine;
    setSelectedRoutine(null);
    setTimeout(() => setEditingRoutine(r), 250);
  };

  const handleDelete = () => {
    const r = selectedRoutine;
    setSelectedRoutine(null);
    Alert.alert('Eliminar rutina', `¿Eliminar "${r.name}" y todos sus días?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteRoutine(r.id) },
    ]);
  };

  const handleCreatePress = () => {
    if (routines.length >= MAX_ROUTINES) {
      Alert.alert(
        'Límite de rutinas',
        `Solo puedes tener ${MAX_ROUTINES} rutinas a la vez. Modifica o elimina una para crear una nueva.`
      );
      return;
    }
    setCreateVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>Hola, {userName}</Text>
        <Text style={styles.subtitle}>Es hora de probar tus límites.</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCreatePress}>
            <ImageBackground
              source={require('../../assets/fondo-gym2.jpg')}
              style={styles.actionImage}
              imageStyle={styles.actionImageRadius}
            >
              <View style={[styles.actionOverlay, styles.actionPrimaryBorder]}>
                <Text style={[styles.actionText]}>Crear Rutina</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>


        </View>

        <Text style={styles.sectionTitle}>Mis Rutinas</Text>

        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            name={routine.name}
            description={routine.description}
            onPress={() => navigation.navigate('RoutineDetail', { routineId: routine.id })}
            onMenuPress={() => setSelectedRoutine(routine)}
          />
        ))}
      </ScrollView>

      <CreateRoutineModal
        visible={createVisible}
        title="Crear Rutina"
        submitLabel="Crear"
        onClose={() => setCreateVisible(false)}
        onSubmit={(name, description) => {
          addRoutine(name, description);
          setCreateVisible(false);
        }}
      />

      <CreateRoutineModal
        visible={!!editingRoutine}
        title="Editar Rutina"
        submitLabel="Guardar"
        initialName={editingRoutine?.name}
        initialDescription={editingRoutine?.description}
        onClose={() => setEditingRoutine(null)}
        onSubmit={(name, description) => {
          editRoutine(editingRoutine.id, name, description);
          setEditingRoutine(null);
        }}
      />

      <Modal
        visible={!!selectedRoutine}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRoutine(null)}
      >
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setSelectedRoutine(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle} numberOfLines={1}>{selectedRoutine?.name}</Text>

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
  scroll: { padding: 20, paddingBottom: 40 },
  greeting: { color: colors.coral, fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  subtitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 4, marginBottom: 24 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  actionButton: { flex: 1, height: 110, borderRadius: 16, overflow: 'hidden' },
  actionImage: { flex: 1, justifyContent: 'flex-end' },
  actionImageRadius: { borderRadius: 16 },
actionOverlay: {
    flex: 1,
    justifyContent: 'center',   
    alignItems: 'center',       
    borderRadius: 16,
    backgroundColor: 'rgba(13,13,24,0.75)',   
  },
  actionPrimaryBorder: { borderWidth: 1.5, borderColor: colors.coral },
  actionText: { color: colors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  sectionTitle: { color: colors.coral, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.elevated, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 32,
  },
  sheetTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 12 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  sheetOptionText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});