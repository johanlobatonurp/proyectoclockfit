import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function RestModal({ visible, seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!visible) return;
    setRemaining(seconds);
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [visible, seconds]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Descanso</Text>
          <Text style={styles.timer}>{formatTime(remaining)}</Text>

          <TouchableOpacity style={styles.skipBtn} onPress={onDone}>
            <Text style={styles.skipText}>Saltar descanso</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: {
    width: '100%', backgroundColor: colors.base, borderRadius: 20, padding: 32,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  title: { color: colors.coral, fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  timer: { color: colors.text, fontSize: 48, fontWeight: 'bold', fontVariant: ['tabular-nums'], marginBottom: 24 },
  skipBtn: { borderWidth: 1.5, borderColor: colors.coral, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  skipText: { color: colors.coral, fontSize: 15, fontWeight: 'bold' },
});