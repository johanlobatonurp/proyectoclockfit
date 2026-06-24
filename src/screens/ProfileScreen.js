import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { profile } = useProfile();
  const { logout } = useAuth();
  const initial = profile.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Perfil</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={[colors.coral, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>Edad: <Text style={styles.ageValue}>{profile.age}</Text></Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <View style={[styles.statBar, { backgroundColor: colors.amber }]} />
                <View>
                  <Text style={styles.statValue}>{profile.weight} kg</Text>
                  <Text style={styles.statLabel}>Peso</Text>
                </View>
              </View>

              <View style={styles.stat}>
                <View style={[styles.statBar, { backgroundColor: colors.amber }]} />
                <View>
                  <Text style={styles.statValue}>{profile.height} cm</Text>
                  <Text style={styles.statLabel}>Altura</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </LinearGradient>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.rowText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.coral} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Exercises')}>
          <Text style={styles.rowText}>Ejercicios Disponibles</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.coral} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row, styles.logoutRow]} onPress={handleLogout}>
          <Text style={[styles.rowText, styles.logoutText]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  title: { color: colors.coral, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 12, marginBottom: 8 },
  scroll: { padding: 20, paddingBottom: 40 },
  headerCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 20, padding: 20, marginBottom: 28,
  },
  headerLeft: { flex: 1 },
  name: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  age: { color: colors.text, fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  ageValue: { fontWeight: '400' },
  statsRow: { flexDirection: 'row', gap: 20, marginTop: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statBar: { width: 5, height: 34, borderRadius: 3 },
  statValue: { color: colors.text, fontSize: 15, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.elevated,
    alignItems: 'center', justifyContent: 'center', marginLeft: 12,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 16,
  },
  rowText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  logoutRow: { marginTop: 16, justifyContent: 'center' },
  logoutText: { color: colors.red },
});