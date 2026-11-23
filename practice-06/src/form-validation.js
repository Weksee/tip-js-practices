"use strict";

export function validateTaskDraft(draft, categories) {
  const errors = {};
  let validTitle = "";
  let validPriority = draft.priority;
  let validCategoryId = null;

  if (typeof draft.title !== "string") {
    errors.title = "Название должно быть строкой";
  } else {
    validTitle = draft.title.trim();
    if (validTitle.length < 1 || validTitle.length > 100) {
      errors.title = "Длина от 1 до 100 символов";
    }
  }

  if (!["low", "medium", "high"].includes(validPriority)) {
    errors.priority = "Неверный приоритет";
  }

  const catId = Number(draft.categoryId);
  if (!Number.isSafeInteger(catId) || catId <= 0) {
    errors.categoryId = "Выберите категорию";
  } else if (!categories.some((c) => c.id === catId)) {
    errors.categoryId = "Категория не найдена";
  } else {
    validCategoryId = catId;
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    value: { title: validTitle, priority: validPriority, categoryId: validCategoryId },
    errors: {}
  };
}