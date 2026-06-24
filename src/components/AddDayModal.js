import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, dayColors } from '../constants/colors';

export default function AddDayModal({
  visible, onClose, onSubmit,
  title = 'Agregar Día', submitLabel = 'Agregar',
  initialName = '', initialDescription = '', defaultColor,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(defaultColor || dayColors[0]);

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setDescription(initialDescription);
      setSelectedColor(defaultColor || dayColors[0]);
    }
  }, [visible, initialName, initialDescription, defaultColor]);

  const handleSubmit = () => {
    if (name.trim() === '') return;
    onSubmit(name.trim(), description.trim(), selectedColor);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.label}>Nombre del Día</Text>
          <TextInput
            style={styles.input} placeholder="Ej: Push" placeholderTextColor={colors.textSecondary}
            value={name} onChangeText={setName}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input} placeholder="Ej: Pecho, hombro y tríceps" placeholderTextColor={colors.textSecondary}
            value={description} onChangeText={setDescription}
          />

          <Text style={styles.label}>Color</Text>
          <View style={styles.swatchRow}>
            {dayColors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.swatch, { backgroundColor: c }, selectedColor === c && styles.swatchSelected]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleSubmit}>
              <Text style={styles.createText}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor: colors.surface, borderRadius: 20, padding: 24 },
  title: { color: colors.coral, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: colors.elevated, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 12, color: colors.text, fontSize: 14, marginBottom: 20,
  },
  swatchRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  swatch: { width: 36, height: 36, borderRadius: 18 },
  swatchSelected: { borderWidth: 3, borderColor: colors.text },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelButton: { borderWidth: 1.5, borderColor: colors.coral },
  createButton: { backgroundColor: colors.coral },
  cancelText: { color: colors.coral, fontSize: 16, fontWeight: 'bold' },
  createText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});