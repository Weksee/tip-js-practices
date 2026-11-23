"use strict";

export function createTaskElement(task, categories = []) {
  const li = document.createElement("li");
  li.className = "task-card";
  li.dataset.taskId = String(task.id);
  if (task.completed) li.classList.add("is-completed");

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;
  li.append(title);

  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = task.completed ? "Выполнена" : "В работе";
  li.append(status);

  const priority = document.createElement("span");
  priority.className = "task-priority";
  priority.textContent = task.priority === "high" ? "Высокий" : task.priority === "low" ? "Низкий" : "Средний";
  li.append(priority);

  let catName = "Без категории";
  if (Array.isArray(categories)) {
    const cat = categories.find((c) => Number(c.id) === Number(task.categoryId));
    if (cat) catName = cat.name;
  } else if (categories && typeof categories === "object" && categories.id) {
    if (Number(categories.id) === Number(task.categoryId)) {
      catName = categories.name;
    }
  }

  const catEl = document.createElement("span");
  catEl.className = "task-category";
  catEl.textContent = catName;
  li.append(catEl);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const createBtn = (action, label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.action = action;
    const span = document.createElement("span");
    span.className = "action-label";
    span.textContent = label;
    btn.append(span);
    return btn;
  };

  const toggleBtn = createBtn("toggle", "Выполнена");
  toggleBtn.setAttribute("aria-pressed", String(task.completed));
  actions.append(toggleBtn);
  actions.append(createBtn("edit", "Изменить"));
  actions.append(createBtn("delete", "Удалить"));

  li.append(actions);
  return li;
}

export function renderTaskList(listElement, tasks, categories = []) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const cards = tasks.map((t) => createTaskElement(t, safeCategories));
  listElement.replaceChildren(...cards);
}