import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function ExerciseCard({
  name, muscles, type, tier, setsInfo,
  onAdd, added, onMenuPress, onPress,
  status, onFinish,
}) {
  const typeLabel = type === 'compound' ? 'COMPUESTO' : 'ACCESORIO';

  let rightAction = null;
  if (onAdd) {
    rightAction = added ? (
      <View style={styles.actionButton}>
        <Ionicons name="checkmark-circle" size={26} color={colors.teal} />
      </View>
    ) : (
      <TouchableOpacity style={styles.actionButton} onPress={onAdd}>
        <Ionicons name="add" size={26} color={colors.coral} />
      </TouchableOpacity>
    );
  } else if (status === 'done') {
    rightAction = (
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={20} color={colors.text} />
      </View>
    );
  } else if (status === 'active') {
    rightAction = (
      <TouchableOpacity style={styles.finishBtn} onPress={onFinish}>
        <Text style={styles.finishText}>Terminar</Text>
      </TouchableOpacity>
    );
  } else if (onMenuPress) {
    rightAction = (
      <TouchableOpacity style={styles.actionButton} onPress={onMenuPress}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.coral} />
      </TouchableOpacity>
    );
  }

  const dim = added || status === 'pending';

  return (
    <View style={[styles.card, dim && styles.cardDim]}>
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
        disabled={!onPress}
      >
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.typeBadge]}>
            <Text style={styles.typeText}>{typeLabel}</Text>
          </View>
          <View style={[styles.badge, styles.tierBadge]}>
            <Text style={styles.tierText}>Tier {tier}</Text>
          </View>
        </View>

        <Text style={styles.name}>{name}</Text>
        {muscles ? <Text style={styles.muscles}>{muscles}</Text> : null}
        {setsInfo ? <Text style={styles.setsInfo}>{setsInfo}</Text> : null}
      </TouchableOpacity>

      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  cardDim: { opacity: 0.45 },
  content: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeBadge: { backgroundColor: 'rgba(255,107,53,0.15)' },
  tierBadge: { backgroundColor: 'rgba(16,217,170,0.15)' },
  typeText: { color: colors.coral, fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  tierText: { color: colors.teal, fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  name: { color: colors.text, fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  muscles: { color: colors.textSecondary, fontSize: 13 },
  setsInfo: { color: colors.text, fontSize: 13, fontWeight: '600', marginTop: 8 },
  actionButton: { padding: 6, marginLeft: 8 },
  checkCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.teal,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  finishBtn: {
    backgroundColor: colors.coral, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18, marginLeft: 8,
  },
  finishText: { color: colors.text, fontSize: 14, fontWeight: 'bold' },
});