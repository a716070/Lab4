// Lab 4 - Simple Todo App

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const itemsLeft = document.getElementById("itemsLeft");
const filterButtons = document.querySelectorAll(".filter-btn");

// Start with two example tasks like the lab picture
let tasks = [
    { id: 1, text: "See Lecture", completed: false },
    { id: 2, text: "Solve assignment", completed: false }
];
let nextId = 3;
let currentFilter = "all";

// Add a new task
function addTask() {
    let text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    tasks.push({ id: nextId, text: text, completed: false });
    nextId++;
    taskInput.value = "";
    showTasks();
    taskInput.focus();
}

// Draw the list on the page
function showTasks() {
    taskList.innerHTML = "";
    let visibleTasks = 0;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        if (currentFilter === "active" && task.completed) {
            continue;
        }
        if (currentFilter === "completed" && !task.completed) {
            continue;
        }

        visibleTasks++;

        let item = document.createElement("li");
        item.className = "task-item";

        // Checkbox: complete or uncomplete a task
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark " + task.text + " as completed");
        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            showTasks();
        });

        // Task name (double-click to edit)
        let name = document.createElement("span");
        name.textContent = task.text;
        name.className = "task-text";
        if (task.completed) {
            name.className += " done";
        }
        name.title = "Double-click to edit";
        name.addEventListener("dblclick", function () {
            editTask(task, item, name);
        });

        // Delete one task
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.setAttribute("aria-label", "Delete " + task.text);
        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (t) {
                return t.id !== task.id;
            });
            showTasks();
        });

        item.appendChild(checkbox);
        item.appendChild(name);
        item.appendChild(deleteBtn);
        taskList.appendChild(item);
    }

    if (visibleTasks === 0) {
        let message = document.createElement("li");
        message.textContent = "No tasks to show";
        message.className = "empty-message";
        taskList.appendChild(message);
    }

    // Count only unfinished tasks
    let remaining = tasks.filter(function (task) {
        return !task.completed;
    }).length;
    itemsLeft.textContent = remaining + (remaining === 1 ? " item left" : " items left");
}

// Edit a task by double-clicking its name
function editTask(task, item, name) {
    let editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = task.text;
    editInput.className = "edit-input";
    editInput.setAttribute("aria-label", "Edit task");
    item.replaceChild(editInput, name);
    editInput.focus();
    editInput.select();

    let finished = false;
    function finishEdit(save) {
        if (finished) {
            return;
        }
        finished = true;
        let newText = editInput.value.trim();
        if (save && newText !== "") {
            task.text = newText;
        }
        showTasks();
    }

    editInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            finishEdit(true);
        } else if (event.key === "Escape") {
            finishEdit(false);
        }
    });
    editInput.addEventListener("blur", function () {
        finishEdit(true);
    });
}

// Add button and Enter key
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Filter: All, Active, Completed
for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function () {
        currentFilter = this.getAttribute("data-filter");

        for (let j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("selected");
        }
        this.classList.add("selected");
        showTasks();
    });
}

// Clear finished tasks
 document.getElementById("clearCompleted").addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });
    showTasks();
});

// Clear all tasks
 document.getElementById("clearAll").addEventListener("click", function () {
    tasks = [];
    showTasks();
});

showTasks();
