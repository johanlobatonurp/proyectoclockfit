import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function DayCard({ name, description, exerciseCount, color, onPress, onMenuPress }) {
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color }]}>{name}</Text>
        <Text style={styles.description}>
          {description}{description ? '  ·  ' : ''}{exerciseCount} ejercicios
        </Text>
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} hitSlop={8}>
        <Ionicons name="ellipsis-vertical" size={20} color={color} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 18, marginBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeftWidth: 4,
  },
  textContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  description: { color: colors.textSecondary, fontSize: 13 },
  menuButton: { padding: 6 },
});