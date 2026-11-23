import { validateTaskDraft } from "./src/form-validation.js";

const categories = []; // Передаем пустой массив категорий
const draft1 = { id: "20", title: "  Изучить localStorage  ", priority: "high" };
const draft2 = { id: "20", title: "  ", priority: "high" };

console.log("Вызов 1:", validateTaskDraft(draft1, categories));
console.log("Вызов 2:", validateTaskDraft(draft2, categories));