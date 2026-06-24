import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockHistory } from '../data/mockHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext();
const STORAGE_KEY = '@clockfit_history';

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const SEED_DEMO_DATA = false;

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          setHistory(JSON.parse(stored));
        } else if (SEED_DEMO_DATA) {
          setHistory(mockHistory);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockHistory)); // lo fija en tu celular
        } else {
          setHistory([]);
        }
      } catch (e) {
        console.warn('Error cargando historial', e);
        setHistory([]);
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