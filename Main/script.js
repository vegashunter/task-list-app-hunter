const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearButton = document.getElementById('clear-btn');

const STORAGE_KEY = 'my-tasks';
let tasks = loadTasks();

addButton.addEventListener('click', addTask);
clearButton.addEventListener('click', clearCompleted);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

function clearCompleted() {
    tasks = tasks.filter((task) => !task.done);
    saveTasks();
    renderTasks();
  }

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }

  const parsed = JSON.parse(saved);

  return parsed.map((item) => {
    if (typeof item === 'string') {
      return { text: item, done: false };
    }
    return item;
  });
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    return;
  }

  tasks.push({ text, done: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

function updateCount() {
  const remaining = tasks.filter((task) => !task.done).length;
  const label = remaining === 1 ? 'task' : 'tasks';
  taskCount.textContent = `${remaining} ${label} left`;
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    if (task.done) {
      li.classList.add('done');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateCount();
}

renderTasks();