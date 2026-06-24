import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useProfile } from '../context/ProfileContext';

export default function EditProfileScreen({ navigation }) {
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [weight, setWeight] = useState(String(profile.weight));
  const [height, setHeight] = useState(String(profile.height));

  const onlyNumbers = (setter) => (v) => setter(v.replace(/[^0-9]/g, ''));

  const handleSave = () => {
    updateProfile({
      name: name.trim() || profile.name,
      age: parseInt(age || '0', 10),
      weight: parseInt(weight || '0', 10),
      height: parseInt(height || '0', 10),
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input} value={name} onChangeText={setName}
          placeholder="Tu nombre" placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput style={styles.input} value={age} onChangeText={onlyNumbers(setAge)} keyboardType="numeric" maxLength={3} />

        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput style={styles.input} value={weight} onChangeText={onlyNumbers(setWeight)} keyboardType="numeric" maxLength={3} />

        <Text style={styles.label}>Altura (cm)</Text>
        <TextInput style={styles.input} value={height} onChangeText={onlyNumbers(setHeight)} keyboardType="numeric" maxLength={3} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4, marginRight: 8 },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold' },
  scroll: { padding: 20 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: colors.elevated, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 12, color: colors.text, fontSize: 15, marginBottom: 20,
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  saveBtn: { backgroundColor: colors.coral, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});