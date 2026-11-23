import { useState, useEffect, useRef, useCallback } from "react";

export function useTaskData({ api, filters }) {
  const [snapshot, setSnapshot] = useState({
    tasks: [],
    categories: [],
    meta: { total: 0 },
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [pending, setPending] = useState(false);

  const [revision, setRevision] = useState(0);
  const activeMutationRef = useRef(null);
  const isMountedRef = useRef(true);

  // 3. Отслеживание монтирования
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // ВАЖНО: Отменяем мутацию при размонтировании (требование теста 14)
      if (activeMutationRef.current) {
        activeMutationRef.current.abort();
        activeMutationRef.current = null;
      }
    };
  }, []);

  // 4. Загрузка данных (GET)
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const data = await api.loadInitialData(
          {
            q: filters.q,
            completed: filters.completed,
            priority: filters.priority,
            categoryId: filters.categoryId,
          },
          { signal: controller.signal }
        );

        if (active) {
          setSnapshot(data);
          setStatus("ready");
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          setError(err);
          setStatus("error");
        }
      }
    }

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [api, filters.q, filters.completed, filters.priority, filters.categoryId, revision]);

  const refresh = useCallback(() => {
    setRevision((prev) => prev + 1);
  }, []);

  // 6. Мутации
  const mutate = useCallback(async (operation) => {
    if (!isMountedRef.current || activeMutationRef.current) {
      return false;
    }

    const controller = new AbortController();
    activeMutationRef.current = controller;
    setPending(true);
    setMutationError(null);

    try {
      await operation(controller.signal);
      
      // Если размонтировали во время запроса — возвращаем false и не обновляем UI
      if (!isMountedRef.current) {
        return false; 
      }
      
      refresh();
      return true;
    } catch (err) {
      if (isMountedRef.current && !controller.signal.aborted) {
        setMutationError(err);
      }
      return false;
    } finally {
      if (activeMutationRef.current === controller) {
        activeMutationRef.current = null;
        if (isMountedRef.current) {
          setPending(false);
        }
      }
    }
  }, [refresh]);

  // 7. Методы
  const saveTask = useCallback(async (id, value) => {
    return mutate((signal) => {
      if (id === null) return api.createTask(value, { signal });
      return api.updateTask(id, value, { signal });
    });
  }, [mutate, api]);

  const toggleTask = useCallback(async (task) => {
    return mutate((signal) => api.setTaskCompleted(task.id, !task.completed, { signal }));
  }, [mutate, api]);

  const deleteTask = useCallback(async (id) => {
    return mutate((signal) => api.deleteTask(id, { signal }));
  }, [mutate, api]);

  const resetData = useCallback(async () => {
    return mutate((signal) => api.resetDemoData({ signal }));
  }, [mutate, api]);

  return {
    snapshot,
    status,
    error,
    mutationError,
    pending,
    refresh,
    saveTask,
    toggleTask,
    deleteTask,
    resetData,
  };
}