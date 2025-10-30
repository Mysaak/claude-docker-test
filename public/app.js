// API Base URL
const API_BASE = '/api';

// DOM Elements
const addTodoForm = document.getElementById('addTodoForm');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const totalCount = document.getElementById('totalCount');
const remainingCount = document.getElementById('remainingCount');
const completedCount = document.getElementById('completedCount');

// State
let todos = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  addTodoForm.addEventListener('submit', handleAddTodo);
});

// Show/Hide Loading
function setLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.classList.remove('hidden');
    todoList.classList.add('hidden');
    emptyState.classList.add('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

// Show Error
function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');
  setTimeout(() => {
    errorMessage.classList.add('hidden');
  }, 5000);
}

// Update Stats
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const remaining = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  remainingCount.textContent = remaining;
}

// Render Todos
function renderTodos() {
  if (todos.length === 0) {
    todoList.innerHTML = '';
    todoList.classList.add('hidden');
    emptyState.classList.remove('hidden');
    updateStats();
    return;
  }

  emptyState.classList.add('hidden');
  todoList.classList.remove('hidden');

  todoList.innerHTML = todos.map(todo => `
    <div class="todo-item bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        ${todo.completed ? 'checked' : ''}
        onchange="toggleTodo(${todo.id})"
        class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
      />
      <span class="flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'} text-lg">
        ${escapeHtml(todo.title)}
      </span>
      <button
        onclick="deleteTodo(${todo.id})"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
      >
        Smazat
      </button>
    </div>
  `).join('');

  updateStats();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load Todos
async function loadTodos() {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/todos`);
    const data = await response.json();

    if (data.status === 'success') {
      todos = data.data;
      renderTodos();
    } else {
      showError('Nepodařilo se načíst úkoly');
    }
  } catch (error) {
    console.error('Error loading todos:', error);
    showError('Chyba při načítání úkolů: ' + error.message);
  } finally {
    setLoading(false);
  }
}

// Add Todo
async function handleAddTodo(e) {
  e.preventDefault();

  const title = todoInput.value.trim();
  if (!title) {
    showError('Název úkolu nesmí být prázdný');
    return;
  }

  // Disable form during submission
  addBtn.disabled = true;
  addBtn.textContent = 'Přidávám...';

  try {
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      todos.unshift(data.data);
      renderTodos();
      todoInput.value = '';
      todoInput.focus();
    } else {
      showError(data.message || 'Nepodařilo se vytvořit úkol');
    }
  } catch (error) {
    console.error('Error adding todo:', error);
    showError('Chyba při vytváření úkolu: ' + error.message);
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = 'Přidat';
  }
}

// Toggle Todo
async function toggleTodo(id) {
  try {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PATCH',
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      const index = todos.findIndex(todo => todo.id === id);
      if (index !== -1) {
        todos[index] = data.data;
        renderTodos();
      }
    } else {
      showError(data.message || 'Nepodařilo se aktualizovat úkol');
      loadTodos(); // Reload to get correct state
    }
  } catch (error) {
    console.error('Error toggling todo:', error);
    showError('Chyba při aktualizaci úkolu: ' + error.message);
    loadTodos();
  }
}

// Delete Todo
async function deleteTodo(id) {
  if (!confirm('Opravdu chcete smazat tento úkol?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      todos = todos.filter(todo => todo.id !== id);
      renderTodos();
    } else {
      showError(data.message || 'Nepodařilo se smazat úkol');
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    showError('Chyba při mazání úkolu: ' + error.message);
  }
}

// Make functions global for onclick handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
