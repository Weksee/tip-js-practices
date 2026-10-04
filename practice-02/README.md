# Практическая работа № 2

**Автор:** Барахоев Абдуллах
**Группа:** ЭФБО-14-25
**Вариант:** 3

## Окружение

- ОС: Windows 11
- Node.js: 24.21.0
- npm: 11.19.0
- Git: 2.53.0
- Браузер: Chrome 130

## Команды запуска

Из корня репозитория:

```bash
node practice-02/examples/functions-and-references.js
```

## Задание 1. Функции, возвращаемые значения и ссылки

| № | Прогноз до запуска | Фактический результат | Причина |
|---|---|---|---|
| 1 | 5 | 5 | Обычное сложение чисел |
| 2 | "23" | "23" | `+` со строками выполняет конкатенацию |
| 3 | ? | undefined | В стрелочной функции с `{}` пропущен `return` |
| 4 | true | true | `alias` и `original` — одна и та же ссылка |
| 5 | false | true | Объекты сравниваются по идентичности |
| 6 | "Изменённый" | "Изменённый" | `[...items]` копирует массив, но не объекты внутри |
| 7 | "Изменённый" | "Изменённый" | Оба массива ссылаются на тот же объект |
| 8 | true | false | Массивы разные |
| 9 | true | true | Объект внутри — тот же |
| 10 | false | false | `oldBook` не изменялся |
| 11 | false | true | Новое свойство перекрыло старое |
| 12 | false | false | `newBook` — новый объект |
| 13 | "Без названия" | "Без названия" | Аргумент не передан |
| 14 | "Без названия" | "Без названия" | `undefined` включает значение по умолчанию |
| 15 | null | null | `null` не включает значение по умолчанию |
| 16 | "" | "" | Пустая строка — переданное значение |

### Исправление эксперимента 2

В исходном коде стрелочная функция с фигурными скобками не имела `return`:

```js
const square = (value) => {
  value * value;
};
```

Вызов `square(4)` возвращал `undefined`. Добавил `return`:

```js
const square = (value) => {
  return value * value;
};
```

Теперь `square(4) === 16`.


## Задание 2. Функция createTask

Реализована функция `createTask(id, title, priority = "medium")` в `src/task-service.js`.

**Контракт:**
- `id` — положительное безопасное целое (`Number.isSafeInteger(id) && id > 0`).
- `title` — строка; после `trim()` длина от 1 до 100. В объект записывается очищенная строка.
- `priority` — строго `"low"`, `"medium"` или `"high"`. По умолчанию `"medium"`.
- При успехе: `{ ok: true, task: { id, title, completed: false, priority } }`.
- При ошибке: `{ ok: false, error: "Понятное сообщение" }`.

**Реализация:**

```js
export function createTask(id, title, priority = "medium") {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  if (typeof title !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }

  const cleanTitle = title.trim();

  if (cleanTitle.length < 1 || cleanTitle.length > 100) {
    return { ok: false, error: "Длина названия должна быть от 1 до 100" };
  }

  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return { ok: false, error: "Приоритет должен быть low, medium или high" };
  }

  return {
    ok: true,
    task: {
      id: id,
      title: cleanTitle,
      completed: false,
      priority: priority,
    },
  };
}
```

**Проверки:**

| Входные данные | Ожидание | Факт | Итог |
|---|---|---|---|
| `createTask(20, "Новая задача", "high")` | Успех, priority=high | Успех, priority=high | Пройдено |
| `createTask(21, "Задача")` | priority=medium | priority=medium | Пройдено |
| `createTask(22, "  Проверить  данные  ")` | title="Проверить  данные" | title="Проверить  данные" | Пройдено |
| `createTask(30, "a")` | Успех | Успех | Пройдено |
| `createTask(31, "a".repeat(100))` | Успех | Успех | Пройдено |
| `createTask(32, "")` | Ошибка | Ошибка | Пройдено |
| `createTask(33, "   ")` | Ошибка | Ошибка | Пройдено |
| `createTask(34, "a".repeat(101))` | Ошибка | Ошибка | Пройдено |
| `createTask(35, 42)` | Ошибка, без падения | Ошибка | Пройдено |
| `createTask(36, null)` | Ошибка, без падения | Ошибка | Пройдено |
| `createTask(0, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(-1, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(1.5, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask("4", "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(NaN, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(Infinity, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(null, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(undefined, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(Number.MAX_SAFE_INTEGER, "Задача")` | Успех | Успех | Пройдено |
| `createTask(Number.MAX_SAFE_INTEGER + 1, "Задача")` | Ошибка | Ошибка | Пройдено |
| `createTask(40, "Задача", "urgent")` | Ошибка | Ошибка | Пройдено |
| `createTask(41, "Задача", "HIGH")` | Ошибка | Ошибка | Пройдено |
| `createTask(42, "Задача", " high ")` | Ошибка | Ошибка | Пройдено |
| `createTask(43, "Задача", null)` | Ошибка | Ошибка | Пройдено |
| `createTask(44, "Задача", 1)` | Ошибка | Ошибка | Пройдено |

**Разные объекты при одинаковых аргументах:**

```js
const a = createTask(20, "Задача", "high").task;
const b = createTask(20, "Задача", "high").task;
console.log(a === b);                            // false
console.log(a.id === b.id, a.title === b.title); // true true
```

Каждый успешный вызов создаёт новый объект задачи.


---

## Задание 3. Чтение списка и расчёт сводки

Файл `src/data.js` содержит общий набор `demoTasks` и набор варианта `variantTasks`.

**Общий набор:**

```js
export const demoTasks = [
  { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
  { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
  { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
  { id: 10, title: "Оформить README", completed: true, priority: "medium" },
];
```

**Набор варианта 3** (тема «Создание сайта-портфолио», первые 2 задачи выполнены):

```js
export const variantTasks = [
  { id: 11, title: "Собрать примеры работ", completed: true, priority: "high" },
  { id: 23, title: "Написать раздел «О себе»", completed: true, priority: "medium" },
  { id: 37, title: "Свёрстать главную страницу", completed: false, priority: "high" },
  { id: 41, title: "Добавить контакты", completed: false, priority: "low" },
  { id: 58, title: "Подключить форму связи", completed: false, priority: "medium" },
  { id: 64, title: "Проверить адаптивность", completed: false, priority: "low" },
];
```

### Реализованные функции

```js
export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  return { total, completed, pending, progress };
}
```

### Таблица проверок

| Проверка | Входные данные | Ожидание | Факт | Итог |
|---|---|---|---|---|
| Поиск id=4 в demoTasks | `findTaskById(demoTasks, 4)` | объект с id=4 | объект с id=4 | Пройдено |
| Поиск несуществующего | `findTaskById(demoTasks, 777)` | `undefined` | `undefined` | Пройдено |
| Поиск строки `"4"` | `findTaskById(demoTasks, "4")` | `undefined` | `undefined` | Пройдено |
| Поиск в пустом массиве | `findTaskById([], 4)` | `undefined` | `undefined` | Пройдено |
| Невыполненные demoTasks | `getPendingTasks(demoTasks)` | id `[4, 7]` | `[4, 7]` | Пройдено |
| Невыполненные из `[]` | `getPendingTasks([])` | `[]` | `[]` | Пройдено |
| Невыполненные, когда всё сделано | `getPendingTasks(allDone)` | `[]` | `[]` | Пройдено |
| Названия demoTasks | `getTaskTitles(demoTasks)` | 4 названия в исходном порядке | 4 названия | Пройдено |
| Названия `[]` | `getTaskTitles([])` | `[]` | `[]` | Пройдено |
| Сводка demoTasks | `getTaskStats(demoTasks)` | `{total:4, completed:2, pending:2, progress:50}` | `{ total: 4, completed: 2, pending: 2, progress: 50 }` | Пройдено |
| Сводка `[]` | `getTaskStats([])` | все поля `0` | `{ total: 0, completed: 0, pending: 0, progress: 0 }` | Пройдено |
| Три задачи, одна выполнена | `getTaskStats(threeWithOneDone)` | `progress ≈ 33.3333…` | `33.33333333333333` | Пройдено |
| Отображение прогресса | `progress.toFixed(1)` | `"33.3"` | `"33.3"` | Пройдено |
| Сводка варианта 3 | `getTaskStats(variantTasks)` | `{total:6, completed:2, pending:4, progress:33.33…}` | `{ total: 6, completed: 2, pending: 4, progress: 33.33333333333333 }` | Пройдено |
| Невыполненные варианта 3 | `getPendingTasks(variantTasks)` | id `[37, 41, 58, 64]` | `[37, 41, 58, 64]` | Пройдено |
| Исходный массив не изменился | `JSON.stringify(demoTasks)` до и после чтения | одинаково | `true` | Пройдено |

### Фактический вывод (фрагмент)

```
=== findTaskById ===
Поиск id=4 в demoTasks:
{
  id: 4,
  title: 'Подготовить модель задач',
  completed: false,
  priority: 'high'
}
Поиск id=777 (нет такой):
undefined
Поиск id="4" (строка, не число):
undefined
Поиск в пустом массиве:
undefined

=== getPendingTasks ===
Невыполненные id в demoTasks: [ 4, 7 ]
Невыполненные в []: []
Всё выполнено: []

=== getTaskTitles ===
Названия demoTasks: [
  'Изучить функции',
  'Подготовить модель задач',
  'Проверить методы массивов',
  'Оформить README'
]
Названия пустого: []

=== getTaskStats ===
Сводка demoTasks: { total: 4, completed: 2, pending: 2, progress: 50 }
Сводка []: { total: 0, completed: 0, pending: 0, progress: 0 }
Сводка 3 задач, 1 выполнена: { total: 3, completed: 1, pending: 2, progress: 33.33333333333333 }
progress.toFixed(1): 33.3

=== Вариант 3 ===
Сводка variantTasks: { total: 6, completed: 2, pending: 4, progress: 33.33333333333333 }
Невыполненные в variantTasks: [ 37, 41, 58, 64 ]
Названия variantTasks: [
  'Собрать примеры работ',
  'Написать раздел «О себе»',
  'Свёрстать главную страницу',
  'Добавить контакты',
  'Подключить форму связи',
  'Проверить адаптивность'
]

demoTasks не изменился: true
```

### Вывод по заданию

Все четыре функции чтения работают по контракту:

- `find` возвращает объект или `undefined`; строка `"4"` не совпадает с числом `4` благодаря строгому сравнению `===`.
- `filter` возвращает новый массив, включая пустой, без изменения исходного.
- `map` возвращает новый массив названий в исходном порядке.
- `getTaskStats` возвращает `progress` числом без предварительного округления; для пустого массива `progress = 0`, деления на ноль нет.

Проверка `demoTasks не изменился: true` подтверждает, что чтение не мутирует входной массив.


---

## Задание 4. Добавление, изменение и удаление

Реализованы четыре функции в `src/task-service.js`.

### Реализация

```js
export function addTask(tasks, id, title, priority = "medium") {
  const created = createTask(id, title, priority);
  if (!created.ok) return created;

  const exists = tasks.some((task) => task.id === id);
  if (exists) {
    return { ok: false, error: "Задача с таким id уже существует" };
  }

  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }
  if (typeof completed !== "boolean") {
    return { ok: false, error: "completed должен быть true или false" };
  }
  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: "Задача не найдена" };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed } : task
  );
  return { ok: true, tasks: newTasks };
}

export function renameTask(tasks, id, title) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }
  if (typeof title !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }
  const cleanTitle = title.trim();
  if (cleanTitle.length < 1 || cleanTitle.length > 100) {
    return { ok: false, error: "Длина названия должна быть от 1 до 100" };
  }
  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: "Задача не найдена" };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, title: cleanTitle } : task
  );
  return { ok: true, tasks: newTasks };
}

export function removeTask(tasks, id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }
  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: "Задача не найдена" };
  }

  const newTasks = tasks.filter((task) => task.id !== id);
  return { ok: true, tasks: newTasks };
}
```

### Таблица проверок

| Проверка | Входные данные | Ожидание | Факт | Итог |
|---|---|---|---|---|
| Добавление | `addTask(demoTasks, 20, "Добавить проверку", "high")` | `ok: true`, длина 5, id=20 в конце | длина 5, id=20 | Пройдено |
| Исходный массив после добавления | `demoTasks.length` | 4 | 4 | Пройдено |
| Добавление дубликата | `addTask(demoTasks, 4, "Дубликат")` | `ok: false`, «уже существует» | «уже существует» | Пройдено |
| Добавление с пустым названием | `addTask(demoTasks, 30, "")` | `ok: false`, ошибка длины | ошибка длины | Пройдено |
| Добавление в `[]` | `addTask([], 1, "Первая")` | `ok: true`, длина 1 | длина 1 | Пройдено |
| Изменение completed | `setTaskCompleted(demoTasks, 4, true)` | `ok: true`, задача стала completed | `completed: true` | Пройдено |
| Исходная задача после setTaskCompleted | `demoTasks.find(t => t.id === 4).completed` | `false` | `false` | Пройдено |
| Неверный тип completed | `"true"`, `1`, `null`, `undefined` | `ok: false` | `ok: false` | Пройдено |
| Отсутствующая задача | `setTaskCompleted(demoTasks, 999, true)` | `ok: false` | «Задача не найдена» | Пройдено |
| Переименование с пробелами | `renameTask(demoTasks, 10, "  Подготовить инструкцию запуска  ")` | `ok: true`, title обрезан | обрезан | Пройдено |
| Исходная задача после rename | `demoTasks.find(t => t.id === 10).title` | `"Оформить README"` | `"Оформить README"` | Пройдено |
| Некорректное название | `""`, `42`, `101 символ` | `ok: false` | `ok: false` | Пройдено |
| Удаление | `removeTask(demoTasks, 7)` | `ok: true`, id `[1, 4, 10]` | `[1, 4, 10]` | Пройдено |
| Исходные id после удаления | `demoTasks.map(t => t.id)` | `[1, 4, 7, 10]` | `[1, 4, 7, 10]` | Пройдено |
| Удаление отсутствующей | `removeTask(demoTasks, 999)`, `removeTask([], 1)` | `ok: false` | `ok: false` | Пройдено |
| Удаление единственной | `removeTask(oneTask, 5)` | `ok: true`, длина 0 | длина 0 | Пройдено |
| Повторная установка статуса | `setTaskCompleted(demoTasks, 1, true)` (уже `true`) | `ok: true`, новый массив и новый объект | `ok: true`, `Новый массив: true`, `Новый объект: true` | Пройдено |
| Отсутствие мутации demoTasks | снимок до и после всех операций | одинаково | `demoTasks не изменился: true` | Пройдено |

### Сценарий варианта 3

Исходный `variantTasks`: 6 задач, id `[11, 23, 37, 41, 58, 64]`, первые 2 (`id = 11` и `id = 23`) выполнены, `progress = 33.33…`.

| Этап | Результат |
|---|---|
| Исходная сводка | `{ total: 6, completed: 2, pending: 4, progress: 33.33… }` |
| После добавления `id = 80` (priority = `low`) | `{ total: 7, completed: 2, pending: 5, progress: 28.571… }` |
| После `setTaskCompleted(vTasks, 11, true)` | `{ total: 7, completed: 2, pending: 5, progress: 28.571… }` |
| После `renameTask(vTasks, 23, "  Обновить раздел «О себе»  ")` | `{ id: 23, title: 'Обновить раздел «О себе»', completed: true, priority: 'medium' }` |
| После удаления `id = 37` | id `[11, 23, 41, 58, 64, 80]` |
| Повторное добавление `id = 80` | `ok: false`, «уже существует» |
| Итоговая сводка | `{ total: 6, completed: 2, pending: 4, progress: 33.33… }` |
| `variantTasks` не изменился | `true` |

**Пояснение про `id = 11`.** Задача `id = 11` уже была выполнена в исходном `variantTasks`. Повторная установка `completed = true` вернула `ok: true` и новый массив и новый объект задачи, но фактическое значение статуса не изменилось — сводка осталась прежней. Это соответствует контракту: повторная установка текущего значения считается успешной. Методичка прямо оговаривает случай варианта 3: если задача уже выполнена, операция всё равно проверяется по контракту.

### Фактический вывод (фрагмент)

```
=== addTask ===
ok: true
Количество задач: 5
Последний id: 20
Исходный массив не изменился: true

=== addTask: дубликат id ===
{ ok: false, error: 'Задача с таким id уже существует' }

=== addTask: некорректное поле ===
{ ok: false, error: 'Длина названия должна быть от 1 до 100' }

=== addTask в пустой массив ===
ok: true длина: 1

=== setTaskCompleted ===
ok: true
Задача id=4 после: {
  id: 4,
  title: 'Подготовить модель задач',
  completed: true,
  priority: 'high'
}
Исходная задача id=4: {
  id: 4,
  title: 'Подготовить модель задач',
  completed: false,
  priority: 'high'
}

=== setTaskCompleted: неверный тип ===
{ ok: false, error: 'completed должен быть true или false' }
{ ok: false, error: 'completed должен быть true или false' }
{ ok: false, error: 'completed должен быть true или false' }
{ ok: false, error: 'completed должен быть true или false' }

=== setTaskCompleted: нет задачи ===
{ ok: false, error: 'Задача не найдена' }

=== renameTask ===
ok: true
Задача id=10 после: {
  id: 10,
  title: 'Подготовить инструкцию запуска',
  completed: true,
  priority: 'medium'
}
Исходная задача id=10: {
  id: 10,
  title: 'Оформить README',
  completed: true,
  priority: 'medium'
}

=== renameTask: некорректное название ===
{ ok: false, error: 'Длина названия должна быть от 1 до 100' }
{ ok: false, error: 'Название должно быть строкой' }
{ ok: false, error: 'Длина названия должна быть от 1 до 100' }

=== renameTask: нет задачи ===
{ ok: false, error: 'Задача не найдена' }

=== removeTask ===
ok: true
id после удаления: [ 1, 4, 10 ]
Исходные id: [ 1, 4, 7, 10 ]

=== removeTask: нет задачи ===
{ ok: false, error: 'Задача не найдена' }
{ ok: false, error: 'Задача не найдена' }

=== removeTask: единственная задача ===
ok: true длина: 0

=== Повторная установка того же статуса ===
ok: true
Новый массив: true
Новый объект id=1: true

=== Проверка отсутствия мутации ===
demoTasks не изменился: true

=== Вариант 3 ===
После добавления: { total: 7, completed: 2, pending: 5, progress: 28.57142857142857 }
После completed id=11: { total: 7, completed: 2, pending: 5, progress: 28.57142857142857 }
После rename id=23: {
  id: 23,
  title: 'Обновить раздел «О себе»',
  completed: true,
  priority: 'medium'
}
После удаления id=37: [ 11, 23, 41, 58, 64, 80 ]
Повторное добавление id=80: { ok: false, error: 'Задача с таким id уже существует' }
Итоговая сводка варианта: { total: 6, completed: 2, pending: 4, progress: 33.33333333333333 }
variantTasks не изменился: true
```

### Вывод по заданию

Все четыре операции соблюдают контракты:

- при успехе возвращается **новый массив**; при изменении конкретной записи — **новый объект** только для неё;
- при ошибке — `{ ok: false, error: "..." }` без побочных эффектов;
- входной массив и его объекты **не мутируются** ни при успехе, ни при ошибке (подтверждено снимками `JSON.stringify` до и после);
- `id` проверяется как положительное безопасное целое, строки не преобразуются в числа;
- для `completed` принимается только `true` или `false`; `"true"`, `1`, `null`, `undefined` отклоняются.

Повторная установка текущего значения также считается успешной и возвращает новый массив и новый объект изменяемой записи, как требует контракт.


---

## Задание 5. Сборка сценария и проверка модуля

В `main.js` реализована функция `runScenario(label, initialTasks, ids)`, которая выполняет одну и ту же последовательность шагов для любого набора:

1. Вывод исходных задач, названий, невыполненных и сводки.
2. Добавление задачи.
3. Изменение `completed`.
4. Переименование.
5. Удаление.
6. Показ отказа (повторное добавление существующего `id`).
7. Проверка сохранности исходного массива через `JSON.stringify` до и после.

Оба сценария — общий на `demoTasks` и индивидуальный на `variantTasks` — запускаются **одной командой**:

```bash
node practice-02/src/main.js
```

Текущее состояние хранится в переменной `current` и заменяется массивом `result.tasks` **только при `result.ok === true`**. При ошибке состояние не меняется.

### Общий сценарий (`demoTasks`)

| Этап | Всего | Выполнено | Осталось | Прогресс |
|---|---:|---:|---:|---|
| Исходный | 4 | 2 | 2 | `50.0%` |
| После добавления `id = 20` | 5 | 2 | 3 | `40.0%` |
| После `setTaskCompleted(id = 4)` | 5 | 3 | 2 | `60.0%` |
| После `renameTask(id = 10)` | 5 | 3 | 2 | `60.0%` |
| После `removeTask(id = 7)` | 4 | 3 | 1 | `75.0%` |
| Повторное добавление `id = 20` | — | — | — | `ok: false` |

Итоговые задачи: `id = [1, 4, 10, 20]`. Единственная невыполненная — `id = 20`.

Исходный `demoTasks` сохранил прежние значения.

### Сценарий варианта 3

| Этап | Всего | Выполнено | Осталось | Прогресс |
|---|---:|---:|---:|---|
| Исходный | 6 | 2 | 4 | `33.3%` |
| После добавления `id = 80` | 7 | 2 | 5 | `28.6%` |
| После `setTaskCompleted(id = 11)` | 7 | 2 | 5 | `28.6%` |
| После `renameTask(id = 23)` | 7 | 2 | 5 | `28.6%` |
| После `removeTask(id = 37)` | 6 | 2 | 4 | `33.3%` |
| Повторное добавление `id = 80` | — | — | — | `ok: false` |

Итоговые задачи: `id = [11, 23, 41, 58, 64, 80]`.

**Пояснение про `id = 11`.** Задача `id = 11` уже была выполнена в исходном `variantTasks`. Шаг `setTaskCompleted(id = 11, true)` вернул `ok: true` и новый массив с новым объектом задачи, но фактическое значение статуса не изменилось, поэтому сводка осталась `28.6%`. Это соответствует контракту: повторная установка текущего значения считается успешной. Методичка прямо оговаривает случай варианта 3: если задача уже выполнена, операция всё равно проверяется по контракту.

Исходный `variantTasks` сохранил прежние значения.

### Обработка отказа

В обоих сценариях показан отказ — повторное добавление уже существующего `id`. При ошибке состояние **не заменяется**. Строка вывода подтверждает это:

```
Состояние НЕ заменяется при ошибке. Задач осталось: 4
```

### Проверка сохранности исходных данных

В конце каждого сценария выводится:

```
Исходный Общий сценарий (demoTasks) не изменился: true
Исходный Вариант 3 не изменился: true
```

Это подтверждает, что все успешные операции возвращали **новые** массивы и объекты, не затрагивая исходные.

### Фактический вывод (фрагмент)

```
============================================================
СЦЕНАРИЙ: Общий сценарий (demoTasks)
============================================================

--- Исходные задачи ---
  id=1 | Изучить функции | completed=true | medium
  id=4 | Подготовить модель задач | completed=false | high
  id=7 | Проверить методы массивов | completed=false | low
  id=10 | Оформить README | completed=true | medium

Названия исходных задач:
[
  'Изучить функции',
  'Подготовить модель задач',
  'Проверить методы массивов',
  'Оформить README'
]

Невыполненные исходные задачи:
[
  'id=4 (Подготовить модель задач)',
  'id=7 (Проверить методы массивов)'
]

Исходная сводка:
Всего: 4; выполнено: 2; осталось: 2
Прогресс: 50.0%

>>> Действие: addTask(current, 20, "Добавить проверку", "high")
OK. Задач стало: 5

Сводка после добавления:
Всего: 5; выполнено: 2; осталось: 3
Прогресс: 40.0%

...

>>> Действие: повторное addTask(current, 20, "Повтор")
Результат: { ok: false, error: 'Задача с таким id уже существует' }
Состояние НЕ заменяется при ошибке. Задач осталось: 4

--- Итоговые задачи ---
  id=1 | Изучить функции | completed=true | medium
  id=4 | Подготовить модель задач | completed=true | high
  id=10 | Подготовить инструкцию запуска | completed=true | medium
  id=20 | Добавить проверку | completed=false | high

Итоговая сводка:
Всего: 4; выполнено: 3; осталось: 1
Прогресс: 75.0%

Исходный Общий сценарий (demoTasks) не изменился: true

============================================================
СЦЕНАРИЙ: Вариант 3
============================================================

--- Исходные задачи ---
  id=11 | Собрать примеры работ | completed=true | high
  id=23 | Написать раздел «О себе» | completed=true | medium
  id=37 | Свёрстать главную страницу | completed=false | high
  id=41 | Добавить контакты | completed=false | low
  id=58 | Подключить форму связи | completed=false | medium
  id=64 | Проверить адаптивность | completed=false | low

Исходная сводка:
Всего: 6; выполнено: 2; осталось: 4
Прогресс: 33.3%

...

--- Итоговые задачи ---
  id=11 | Собрать примеры работ | completed=true | high
  id=23 | Обновить раздел «О себе» | completed=true | medium
  id=41 | Добавить контакты | completed=false | low
  id=58 | Подключить форму связи | completed=false | medium
  id=64 | Проверить адаптивность | completed=false | low
  id=80 | Сделать страницу благодарности | completed=false | low

Итоговая сводка:
Всего: 6; выполнено: 2; осталось: 4
Прогресс: 33.3%

Исходный Вариант 3 не изменился: true
```

### Вывод по заданию

Модуль собран целиком:

- **данные** — `data.js` (`demoTasks` и `variantTasks`);
- **прикладные функции** — `task-service.js` (девять функций);
- **сценарии** — `main.js` (общий и индивидуальный, запускаются одной командой без ручной подмены массивов).

Отказ не повреждает состояние, исходные данные сохраняются. Все шаги видны в выводе, что позволяет защитить решение: показать любую операцию, объяснить контракт и изменить данные на месте.


---

## Собственные проверки

Дополнительно к общим проверкам добавлены три собственных случая в отдельном файле `src/own-checks.js`. Запуск:

```bash
node practice-02/src/own-checks.js
```

### Своя проверка 1. Последовательность add → remove → add

Проверяет, что удаление не сбивает порядок остальных записей и что новые id не путаются.

```js
let t1 = [{ id: 1, title: "A", completed: false, priority: "low" }];
t1 = addTask(t1, 2, "B").tasks;
t1 = removeTask(t1, 1).tasks;
t1 = addTask(t1, 3, "C").tasks;
```

| Ожидание | Факт |
|---|---|
| id `[2, 3]` | `[2, 3]` |
| Сводка `{total:2, completed:0, pending:2, progress:0}` | совпадает |

### Своя проверка 2. Обновление первой и последней записи

Проверяет, что `map` затрагивает только совпавший `id`.

```js
let t2 = [
  { id: 10, title: "Первая", completed: false, priority: "low" },
  { id: 20, title: "Средняя", completed: false, priority: "medium" },
  { id: 30, title: "Последняя", completed: false, priority: "high" },
];
t2 = setTaskCompleted(t2, 10, true).tasks;
t2 = setTaskCompleted(t2, 30, true).tasks;
```

| Ожидание | Факт |
|---|---|
| Выполненные id `[10, 30]` | `[10, 30]` |
| Невыполненные id `[20]` | `[20]` |
| Прогресс `66.666…` (не округлён) | `66.66666666666666` |

### Своя проверка 3. Последовательное обновление нескольких задач

Проверяет, что каждая успешная операция возвращает **новый** массив, а предыдущие состояния сохраняются.

```js
const step0 = t3;
const step1 = setTaskCompleted(step0, 1, true).tasks;
const step2 = setTaskCompleted(step1, 2, true).tasks;
const step3 = setTaskCompleted(step2, 3, true).tasks;
```

| Ожидание | Факт |
|---|---|
| `step0` — все `completed === false` | `true` |
| `step1` — только id=1 `true` | `true` |
| `step2` — id=1 и id=2 `true` | `true` |
| `step3` — все `true`, прогресс `100` | `true`, `{total:3, completed:3, pending:0, progress:100}` |
| `step1 !== step0`, `step2 !== step1`, `step3 !== step2` | все `true` |
| `t3` не изменился (все `completed === false`) | `true` |

### Фактический вывод

```
=== Собственная проверка 1: add → remove → add ===
Итоговые id: [ 2, 3 ]
Итоговая сводка: { total: 2, completed: 0, pending: 2, progress: 0 }

=== Собственная проверка 2: обновление первой и последней ===
Выполненные id: [ 10, 30 ]
Невыполненные id: [ 20 ]
Сводка: { total: 3, completed: 2, pending: 1, progress: 66.66666666666666 }

=== Собственная проверка 3: последовательное обновление ===
step0 — все false: true
step1 — id=1 true: true id=2,3 false: false false
step2 — id=1,2 true: true true
step3 — все true: true
step1 !== step0: true
step2 !== step1: true
step3 !== step2: true
Итоговая сводка: { total: 3, completed: 3, pending: 0, progress: 100 }

t3 не изменился: true
```

Все три случая пройдены. Они покрывают последовательность операций, изменение крайних записей и цепочку обновлений — то, чего нет в общих проверках.