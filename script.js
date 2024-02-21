const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
  event.preventDefault();

  const todoValue = todoInput.value.trim();

  // Check if the input field is empty
  if (todoValue === "") {
    todoInput.classList.add("shake-animation");
    todoInput.addEventListener("animationend", function () {
      todoInput.classList.remove("shake-animation");
    });

    return; // Exit the function early if the input field is empty
  }

  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo", "scale-anim");
  const newTodo = document.createElement("li");
  newTodo.innerText = todoValue;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  //ADDING TO LOCAL STORAGE
  saveLocalTodos(todoValue);

  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  todoButton.classList.add("blob-animation");

  // Reset the input field value after adding todo
  todoInput.value = "";

  // Remove Animation
  todoButton.addEventListener("animationend", function () {
    todoButton.classList.remove("blob-animation");
  });

  // Remove Animation
  todoDiv.addEventListener("animationend", function () {
    todoDiv.classList.remove("scale-anim");
  });

  setTimeout(function () {
    if (todoList.firstChild) {
      todoList.insertBefore(todoDiv, todoList.firstChild);
    } else {
      todoList.appendChild(todoDiv);
    }
  }, 140);
}

function deleteCheck(e) {
  const item = e.target;

  if (item.classList.contains("trash-btn")) {
    const todo = item.parentElement;
    todo.classList.add("slide");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  if (item.classList.contains("complete-btn")) {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    updateLocalTodos(todo);
  }
}

function updateLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoIndex = todo.children[0].innerText;
  todos.forEach((todoItem) => {
    if (todoItem.task === todoIndex) {
      todoItem.completed = todo.classList.contains("completed");
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "incomplete":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function saveLocalTodos(todo, completed = false) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push({ task: todo, completed: completed });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (todo.completed) {
      todoDiv.classList.add("completed");
    }
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // tilføj liste styling igen efter reload
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoIndex = todo.children[0].innerText;
  todos = todos.filter((todoItem) => todoItem.task !== todoIndex);
  localStorage.setItem("todos", JSON.stringify(todos));
}

