const STORAGE_KEY = "todoTasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let currentFilter = "all";

let searchText = "";

// DOM ELEMENTS

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const filters = document.getElementById("filters");

const clearCompletedBtn =
  document.getElementById("clearCompleted");

const searchInput =
  document.getElementById("searchInput");

const emptyState =
  document.getElementById("emptyState");

const totalCount =
  document.getElementById("totalCount");

const activeCount =
  document.getElementById("activeCount");

const completedCount =
  document.getElementById("completedCount");

// LOCAL STORAGE


function saveTasks() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );

}


function addTask(text) {

  const trimmedText = text.trim();

  if (!trimmedText) {

    taskInput.focus();

    return;
  }


  const newTask = {

    id: Date.now(),

    text: trimmedText,

    completed: false

  };


  tasks.push(newTask);

  saveTasks();

  renderTasks();

  taskInput.value = "";

  taskInput.focus();

}


function getFilteredTasks() {

  let filteredTasks = [...tasks];


  // Filter

  if (currentFilter === "active") {

    filteredTasks =
      filteredTasks.filter(
        task => !task.completed
      );

  }


  if (currentFilter === "completed") {

    filteredTasks =
      filteredTasks.filter(
        task => task.completed
      );

  }


  // Search

  if (searchText) {

    filteredTasks =
      filteredTasks.filter(task =>
        task.text
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );

  }


  return filteredTasks;

}


function renderTasks() {

  taskList.innerHTML = "";


  const filteredTasks =
    getFilteredTasks();


  // Empty state

  if (filteredTasks.length === 0) {

    emptyState.style.display = "block";

  } else {

    emptyState.style.display = "none";

  }


  // Create task elements

  filteredTasks.forEach(task => {

    const li =
      document.createElement("li");


    li.className = "task-item";


    if (task.completed) {

      li.classList.add("completed");

    }


    li.dataset.id = task.id;


    // Checkbox

    const checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "toggle-task";

    checkbox.checked = task.completed;


    // Text

    const span =
      document.createElement("span");

    span.className = "task-text";

    span.textContent = task.text;


    // Edit button

    const editButton =
      document.createElement("button");

    editButton.className = "edit-btn";

    editButton.dataset.action = "edit";

    editButton.textContent = "Edit";


    // Delete button

    const deleteButton =
      document.createElement("button");

    deleteButton.className = "delete-btn";

    deleteButton.dataset.action = "delete";

    deleteButton.textContent = "Delete";


    // Add elements

    li.appendChild(checkbox);

    li.appendChild(span);

    li.appendChild(editButton);

    li.appendChild(deleteButton);


    taskList.appendChild(li);

  });


  updateStatistics();

}

function updateStatistics() {

  const total = tasks.length;

  const completed =
    tasks.filter(task => task.completed).length;

  const active =
    total - completed;


  totalCount.textContent = total;

  activeCount.textContent = active;

  completedCount.textContent = completed;


  taskCount.textContent =
    `${active} ${active === 1 ? "task" : "tasks"} left`;

}

function toggleTask(id) {

  const task =
    tasks.find(task => task.id == id);


  if (!task) return;


  task.completed =
    !task.completed;


  saveTasks();

  renderTasks();

}


function deleteTask(id) {

  tasks =
    tasks.filter(
      task => task.id != id
    );


  saveTasks();

  renderTasks();

}


function editTask(id) {

  const task =
    tasks.find(
      task => task.id == id
    );


  if (!task) return;


  const newText =
    prompt(
      "Edit your task:",
      task.text
    );


  if (newText === null) {

    return;

  }


  const trimmedText =
    newText.trim();


  if (!trimmedText) {

    return;

  }


  task.text = trimmedText;


  saveTasks();

  renderTasks();

}

taskList.addEventListener(
  "click",
  function(event) {

    const taskElement =
      event.target.closest(".task-item");


    if (!taskElement) return;


    const id =
      taskElement.dataset.id;


    // Delete

    if (
      event.target.classList.contains(
        "delete-btn"
      )
    ) {

      deleteTask(id);

      return;

    }


    // Edit

    if (
      event.target.classList.contains(
        "edit-btn"
      )
    ) {

      editTask(id);

    }

  }
);

taskList.addEventListener(
  "change",
  function(event) {

    if (
      !event.target.classList.contains(
        "toggle-task"
      )
    ) {

      return;

    }


    const taskElement =
      event.target.closest(".task-item");


    toggleTask(
      taskElement.dataset.id
    );

  }
);


taskForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    addTask(taskInput.value);

  }
);

filters.addEventListener(
  "click",
  function(event) {

    if (
      !event.target.classList.contains(
        "filter-btn"
      )
    ) {

      return;

    }


    currentFilter =
      event.target.dataset.filter;


    document
      .querySelectorAll(".filter-btn")
      .forEach(button => {

        button.classList.remove(
          "active"
        );

      });


    event.target.classList.add(
      "active"
    );


    renderTasks();

  }
);

searchInput.addEventListener(
  "input",
  function(event) {

    searchText =
      event.target.value.trim();


    renderTasks();

  }
);

clearCompletedBtn.addEventListener(
  "click",
  function() {

    tasks =
      tasks.filter(
        task => !task.completed
      );


    saveTasks();

    renderTasks();

  }
);


renderTasks();