import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockHistory } from '../data/mockHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext();
const STORAGE_KEY = '@clockfit_history';

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        setHistory(parsed.length > 0 ? parsed : mockHistory);
      } catch (e) {
        console.warn('Error cargando historial', e);
        setHistory(mockHistory);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history)).catch((e) =>
      console.warn('Error guardando historial', e)
    );
  }, [history, loaded]);

  const addWorkoutRecord = (record) => setHistory((prev) => [record, ...prev]);
  const deleteWorkoutRecord = (id) =>
    setHistory((prev) => prev.filter((r) => r.id !== id));

  const clearHistory = () => setHistory([]);

  return (
    <HistoryContext.Provider value={{ history, addWorkoutRecord, deleteWorkoutRecord, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}