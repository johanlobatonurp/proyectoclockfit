import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('clockfit@gmail.com');
  const [password, setPassword] = useState('clockfit123');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Image
            source={require('../../assets/logo-clockfit.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
          />

          <TouchableOpacity style={styles.button} onPress={login} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },
  logo: { width: 140, height: 140, alignSelf: 'center', marginBottom: 48 },
  label: { color: colors.coral, fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  input: {
    backgroundColor: colors.elevated, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 14, color: colors.text, fontSize: 15, marginBottom: 22,
  },
  button: {
    backgroundColor: colors.coral, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 16,
  },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});