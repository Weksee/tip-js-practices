import { getTaskStats } from "./task-service.js";

// Здесь создаётся DOM, но не изменяется состояние приложения.
// Контракт карточки, селекторы и тексты описаны в методичке.
export function createTaskElement(task) {
  // Корневой li
  const li = document.createElement("li");
  li.className = "task-card";
  li.dataset.taskId = String(task.id);
  if (task.completed === true) {
    li.classList.add("is-completed");
  }

  // Название
  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;
  li.append(title);

  // Статус
  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = task.completed === true ? "Выполнена" : "В работе";
  li.append(status);

  // Приоритет
  const priority = document.createElement("span");
  priority.className = "task-priority";
  priority.textContent = priorityText(task.priority);
  li.append(priority);

  // Контейнер для кнопок
  const actions = document.createElement("div");
  actions.className = "task-actions";

  // Кнопка изменения статуса
  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.dataset.action = "toggle";
  toggleButton.setAttribute("aria-pressed", String(task.completed === true));

  const toggleLabel = document.createElement("span");
  toggleLabel.className = "action-label";
  toggleLabel.textContent = "Выполнена";
  toggleButton.append(toggleLabel);
  actions.append(toggleButton);

  // Кнопка удаления
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";

  const deleteLabel = document.createElement("span");
  deleteLabel.className = "action-label";
  deleteLabel.textContent = "Удалить";
  deleteButton.append(deleteLabel);
  actions.append(deleteButton);

  li.append(actions);

  return li;
}

function priorityText(priority) {
  if (priority === "low") return "Низкий";
  if (priority === "medium") return "Средний";
  if (priority === "high") return "Высокий";
  return String(priority);
}

export function renderTaskList(listElement, tasks) {
  // Создаём карточки и заменяем детей.
  // Сам listElement сохраняется: на нём находится делегированный обработчик.
  const cards = tasks.map((task) => createTaskElement(task));
  listElement.replaceChildren(...cards);
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  // TODO: реализуем в задании 4.
  // getTaskStats(tasks) — сводка по всему массиву.
  // visibleCount — длина отфильтрованного списка.
  throw new Error("Не реализовано: renderSummary");
}

export function renderEmptyState(messageElement, total, visibleCount) {
  // TODO: реализуем в задании 4.
  throw new Error("Не реализовано: renderEmptyState");
}