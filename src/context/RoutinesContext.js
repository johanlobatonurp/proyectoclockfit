import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoutinesContext = createContext();
const STORAGE_KEY = '@clockfit_routines';

const SEED = [];

export function RoutinesProvider({ children }) {
  const [routines, setRoutines] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setRoutines(stored !== null ? JSON.parse(stored) : SEED);
      } catch (e) {
        console.warn('Error cargando rutinas', e);
        setRoutines(SEED);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines)).catch((e) =>
      console.warn('Error guardando rutinas', e)
    );
  }, [routines, loaded]);

  const addRoutine = (name, description) => {
    setRoutines((prev) => [...prev, { id: Date.now().toString(), name, description, days: [] }]);
  };

  const addDay = (routineId, name, description, color) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, days: [...r.days, { id: Date.now().toString(), name, description, color, exercises: [] }] }
          : r
      )
    );
  };

  const addExerciseToDay = (routineId, dayId, exercise) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          days: r.days.map((d) => {
            if (d.id !== dayId) return d;
            const newExercise = {
              id: Date.now().toString(),
              exerciseId: exercise.id,
              name: exercise.name,
              muscles: exercise.muscles,
              type: exercise.type,
              tier: exercise.tier,
              series: [
                { reps: 10, weight: 0 },
                { reps: 10, weight: 0 },
              ],
            };
            return { ...d, exercises: [...d.exercises, newExercise] };
          }),
        };
      })
    );
  };

  const updateExerciseSeries = (routineId, dayId, exerciseInstanceId, series) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          days: r.days.map((d) =>
            d.id !== dayId
              ? d
              : {
                  ...d,
                  exercises: d.exercises.map((e) =>
                    e.id === exerciseInstanceId ? { ...e, series } : e
                  ),
                }
          ),
        };
      })
    );
  };

  const deleteExerciseFromDay = (routineId, dayId, exerciseInstanceId) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          days: r.days.map((d) =>
            d.id !== dayId
              ? d
              : { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseInstanceId) }
          ),
        };
      })
    );
  };

    const editRoutine = (routineId, name, description) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, name, description } : r))
    );
  };

  const deleteRoutine = (routineId) => {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  };

  const editDay = (routineId, dayId, name, description, color) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, days: r.days.map((d) => (d.id === dayId ? { ...d, name, description, color } : d)) }
          : r
      )
    );
  };

  const deleteDay = (routineId, dayId) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId ? { ...r, days: r.days.filter((d) => d.id !== dayId) } : r
      )
    );
  };

  return (
    <RoutinesContext.Provider
      value={{
        routines, loaded,
        addRoutine, editRoutine, deleteRoutine,
        addDay, editDay, deleteDay,
        addExerciseToDay, updateExerciseSeries, deleteExerciseFromDay,
      }}
    >
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines() {
  return useContext(RoutinesContext);
}