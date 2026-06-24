import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileContext = createContext();
const STORAGE_KEY = '@clockfit_profile';

const DEFAULT_PROFILE = { name: 'Johan', age: 25, weight: 75, height: 178 };

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) setProfile(JSON.parse(stored));
      } catch (e) {
        console.warn('Error cargando perfil', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile)).catch((e) =>
      console.warn('Error guardando perfil', e)
    );
  }, [profile, loaded]);

  const updateProfile = (updates) => setProfile((prev) => ({ ...prev, ...updates }));

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}