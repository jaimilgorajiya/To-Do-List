const todoList = [];
        
function renderTodoList() {
  const todoListContainer = document.querySelector('.js-todo-list');
  updateStats();
  
  if (todoList.length === 0) {
    todoListContainer.innerHTML = `
      <div class="empty-state">
        <p>No tasks yet! Add a new task to get started.</p>
      </div>
    `;
    return;
  }

  let todoListHTML = '';

  todoList.forEach((todoObject, i) => {
    const { name, dueDate, completed } = todoObject;
    const date = new Date(dueDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const html = `
      <div class="todo-item ${completed ? 'completed' : ''}">
        <div>
          <input type="checkbox" 
            ${completed ? 'checked' : ''} 
            onchange="toggleComplete(${i})"
          >
          <span style="${completed ? 'text-decoration: line-through' : ''}">${name}</span>
        </div>
        <div>${formattedDate}</div>
        <button onclick="deleteTodo(${i})" class="delete-todo-button">
          Delete
        </button>
      </div>
    `;
    todoListHTML += html;
  });

  todoListContainer.innerHTML = todoListHTML;
}

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const dateInputElement = document.querySelector('.js-due-date-input');
  
  const name = inputElement.value.trim();
  const dueDate = dateInputElement.value;
  
  if (!name || !dueDate) {
    alert('Please fill in all fields!');
    return;
  }
  
  todoList.push({
    name,
    dueDate,
    completed: false
  });
  
  inputElement.value = '';
  dateInputElement.value = '';
  
  renderTodoList();
  saveTodos();
}

function deleteTodo(index) {
  todoList.splice(index, 1);
  renderTodoList();
  saveTodos();
}

function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  renderTodoList();
  saveTodos();
}

function updateStats() {
  const total = todoList.length;
  const completed = todoList.filter(todo => todo.completed).length;
  const pending = total - completed;

  document.getElementById('total-tasks').textContent = total;
  document.getElementById('completed-tasks').textContent = completed;
  document.getElementById('pending-tasks').textContent = pending;
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todoList));
}

function loadTodos() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    todoList.push(...JSON.parse(savedTodos));
    renderTodoList();
  }
}

// Load saved todos when page loads
loadTodos();

// Add keyboard shortcut for adding todos
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTodo();
  }
});