// Запуск приложения

// Функция для создания обработчиков событий
function attachEventHandlers(todoItem, itemsArray, listName) {
  // Обработчик кнопки "Удалить"
  todoItem.deleteButton.addEventListener("click", function () {
    if (confirm("Вы уверены?")) {
      let indexToRemove = itemsArray.findIndex(
        (item) => item.id === todoItem.id
      );

      if (indexToRemove != -1) {
        itemsArray.splice(indexToRemove, 1);
        saveToLocalStorage(listName, itemsArray);
      }
      todoItem.item.remove();
    }
  });

  // Обработчик кнопки "Готово"
  todoItem.doneButton.addEventListener("click", function () {
    todoItem.item.classList.toggle("list-group-item-success");
    todoItem.done = !todoItem.done;

    // Находим элемент в todoList по id
    let selectedItem = itemsArray.find((item) => item.id === todoItem.id);

    // Если элемент найден, изменяем его свойство success на true и наоборот
    if (selectedItem) {
      selectedItem.done = todoItem.done;
    }
    saveToLocalStorage(listName, itemsArray);
  });
}

function createTodoApp(container, title, listName) {
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  let itemsArray = [];

  // Проверяем наличие данных в Local Storage, если они там есть, делаем их содержимым массива tasks и отрисовываем страницу при помощи данных из Local Storage

  if (localStorage.getItem(listName)) {
    itemsArray = JSON.parse(localStorage.getItem(listName));
    itemsArray.forEach(function (task) {
      renderTask(task, todoList, itemsArray, listName);
    });
  }

  // Обработка нажатия на кнопку "Добавить дело"
  todoItemForm.form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!todoItemForm.input.value) {
      return;
    }

    let maxId = Math.max(...itemsArray.map((item) => item.id), 0);
    let todoItem = createTodoItem(maxId + 1, todoItemForm.input.value, false);
    todoList.appendChild(todoItem.item);

    itemsArray.push({
      id: maxId + 1,
      name: todoItemForm.input.value,
      done: false,
    });

    saveToLocalStorage(listName, itemsArray);

    todoItemForm.input.value = "";
    todoItemForm.input.focus();
    todoItemForm.checkInput();

    // Запускаем функцию, указываем ключ
    saveToLocalStorage(listName, itemsArray);

    // Прикрепляем обработчики событий к кнопкам "Готово" и "Удалить"
    attachEventHandlers(todoItem, itemsArray, listName);
  });
}

// Функция для верстки задач из Local storage

function renderTask(task, todoList, itemsArray, listName) {
  console.log("Функция Render Task запущена");

  let todoItem = createTodoItem(task.id, task.name, task.done);
  todoList.appendChild(todoItem.item);
  if (task.done) {
    console.log("kghkhg");
    todoItem.item.classList.add("list-group-item-success");
  }
  attachEventHandlers(todoItem, itemsArray, listName);
}

// создаем и возвращаем заголовок приложения
function createAppTitle(title) {
  let appTitle = document.createElement("h2");
  appTitle.innerHTML = title;
  return appTitle;
}

// создаем и возвращаем форму для создания дела
function createTodoItemForm() {
  let form = document.createElement("form");
  let input = document.createElement("input");
  let buttonWrapper = document.createElement("div");
  let button = document.createElement("button");

  form.classList.add("input-group", "mb-3");
  input.classList.add("form-control");
  input.placeholder = "Введите название нового дела";
  buttonWrapper.classList.add("input-group-append");
  button.classList.add("btn", "btn-primary");
  button.textContent = "Добавить дело";

  // Автоматически устанавливаем атрибут Disabled на кнопке, поскольку при загрузке приложения форма добавления нового дела всегда пустая

  button.setAttribute("disabled", "true");

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  input.addEventListener("input", checkInput);

  // Функция на проверку поля ввода, чтобы снять атрибут Disabled с кнопки "Добавить дело"

  function checkInput() {
    if (input.value.trim() !== "") {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "true");
    }
  }

  return {
    form,
    input,
    button,
    checkInput,
  };
}

// создаем и возвращаем список элементов
function createTodoList() {
  let list = document.createElement("ul");
  list.classList.add("list-group");
  return list;
}

// Создание элемента списка с кнопками

function createTodoItem(id, name, success) {
  let item = document.createElement("li");
  // Помещаем кнопки в стилизованный элемент
  let buttonGroup = document.createElement("div");
  let doneButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  // Устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью флекса
  item.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  item.textContent = name;

  buttonGroup.classList.add("btn-group", "btn-group-sm");
  doneButton.classList.add("btn", "btn-success");
  doneButton.textContent = "Готово";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.textContent = "Удалить";

  // Вкладываем кнопки в отдельный элемент для объединения в блоки

  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  // Даем приложению доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия

  return {
    item,
    doneButton,
    deleteButton,
    id,
  };
}

// Объявляем массив для хранения элементов списка дел

let todoItemsArray = [];

// Функция для сохранения данных в локальном хранилище

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Функция для чтения данных в локальном хранилище

function readLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

window.createTodoApp = createTodoApp;
