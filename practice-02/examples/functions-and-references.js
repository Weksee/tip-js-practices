"use strict";

// ============================================================
// Эксперимент 1. Сложение чисел и строк
// ============================================================
console.log("=== Эксперимент 1 ===");

function sum(a, b) {
  return a + b;
}

console.log("sum(2, 3) =", sum(2, 3));
console.log("sum('2', '3') =", sum("2", "3"));

// ============================================================
// Эксперимент 2. Стрелочная функция с фигурными скобками
// ============================================================
console.log("\n=== Эксперимент 2 ===");

const square = (value) => {
  return value * value;
};

console.log("square(4) =", square(4));

// ============================================================
// Эксперимент 3. Объект и ссылка
// ============================================================
console.log("\n=== Эксперимент 3 ===");

const original = { title: "Черновик", published: false };
const alias = original;

alias.published = true;

console.log("original.published =", original.published);
console.log("original === alias =", original === alias);

// ============================================================
// Эксперимент 4. Копирование массива объектов через spread
// ============================================================
console.log("\n=== Эксперимент 4 ===");

const items = [
  { id: 1, name: "Первый" },
  { id: 2, name: "Второй" },
];

const itemsCopy = [...items];
itemsCopy[0].name = "Изменённый";

console.log("items[0].name =", items[0].name);
console.log("itemsCopy[0].name =", itemsCopy[0].name);
console.log("items === itemsCopy =", items === itemsCopy);
console.log("items[0] === itemsCopy[0] =", items[0] === itemsCopy[0]);

// ============================================================
// Эксперимент 5. Spread объекта и порядок свойств
// ============================================================
console.log("\n=== Эксперимент 5 ===");

const oldBook = { id: 12, title: "Черновик", available: false };
const newBook = { ...oldBook, available: true };

console.log("oldBook.available =", oldBook.available);
console.log("newBook.available =", newBook.available);
console.log("oldBook === newBook =", oldBook === newBook);

// ============================================================
// Эксперимент 6. Параметр по умолчанию
// ============================================================
console.log("\n=== Эксперимент 6 ===");

function makeCaption(text = "Без названия") {
  return text;
}

console.log("makeCaption() =", makeCaption());
console.log("makeCaption(undefined) =", makeCaption(undefined));
console.log("makeCaption(null) =", makeCaption(null));
console.log("makeCaption('') =", makeCaption(""));