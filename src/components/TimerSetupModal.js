import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const OPTIONS = [30, 45, 60, 90];

export default function TimerSetupModal({ visible, onClose, onStart }) {
  const [selected, setSelected] = useState(30);

  useEffect(() => {
    if (visible) setSelected(30);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Tiempo de entrenamiento</Text>

          <View style={styles.grid}>
            {OPTIONS.map((min) => {
              const active = selected === min;
              return (
                <TouchableOpacity
                  key={min}
                  style={[styles.option, active ? styles.optionActive : styles.optionInactive]}
                  onPress={() => setSelected(min)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionNumber, active ? styles.textActive : styles.textInactive]}>
                    {min}
                  </Text>
                  <Text style={[styles.optionUnit, active ? styles.textActive : styles.textInactive]}>
                    Minutos
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.backBtn]} onPress={onClose}>
              <Text style={styles.backText}>Regresar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.startBtn]} onPress={() => onStart(selected)}>
              <Text style={styles.startText}>Empezar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: {
    width: '100%', backgroundColor: colors.base, borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: colors.border,
  },
  title: { color: colors.coral, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  option: {
    width: '48%', borderRadius: 16, paddingVertical: 22, paddingHorizontal: 16, marginBottom: 14,
    flexDirection: 'row', alignItems: 'baseline',
  },
  optionActive: { backgroundColor: colors.coral },
  optionInactive: { backgroundColor: colors.elevated },
  optionNumber: { fontSize: 22, fontWeight: 'bold' },
  optionUnit: { fontSize: 15, fontWeight: '600', marginLeft: 8 },
  textActive: { color: colors.text },
  textInactive: { color: colors.textSecondary },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  backBtn: { borderWidth: 1.5, borderColor: colors.coral },
  backText: { color: colors.coral, fontSize: 16, fontWeight: 'bold' },
  startBtn: { backgroundColor: colors.coral },
  startText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});