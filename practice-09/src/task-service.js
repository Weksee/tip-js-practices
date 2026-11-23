export function selectTasks(tasks, filters) {
  return tasks.filter((task) => {
    if (filters.completed !== null && task.completed !== filters.completed) {
      return false;
    }
    if (filters.priority !== null && task.priority !== filters.priority) {
      return false;
    }
    if (filters.categoryId !== null && task.categoryId !== filters.categoryId) {
      return false;
    }
    if (filters.q) {
      const search = filters.q.toLocaleLowerCase('ru-RU');
      const title = task.title.toLocaleLowerCase('ru-RU');
      if (!title.includes(search)) {
        return false;
      }
    }
    return true;
  });
}

export function findTask(tasks, id) {
  return tasks.find((task) => task.id === id) || null;
}