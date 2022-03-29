import { 
    checkAuth, 
    createTodo, 
    completeTodo,
    getTodos,
    logout,
    deleteAllTodos, 
} from '../fetch-utils.js';
import { renderTodo } from '../render-utils.js';

checkAuth();

const todosEl = document.querySelector('.todos');
const todoForm = document.querySelector('.todo-form');
const logoutButton = document.querySelector('#logout');
const deleteButton = document.querySelector('.delete-button');
const loadingEl = document.querySelector('.loading-spinner');

function toggleLoadingSpinner() {
    loadingEl.classList.toggle('invisible');
}

todoForm.addEventListener('submit', async (e) => {
    // on submit, create a todo, reset the form, and display the todos
    e.preventDefault();
    const data = new FormData(todoForm);
    const todo = data.get('todo');
    await createTodo(todo);
    todoForm.reset();
    await displayTodos();
});

async function displayTodos() {
    toggleLoadingSpinner();
    // fetch the todos
    const todos = await getTodos();
    todosEl.textContent = '';
    // display the list of todos
    for (let todo of todos) {
        const todoEl = renderTodo(todo);
        todoEl.addEventListener('click', async () => {
            await completeTodo(todo.id);
            displayTodos();
            
        });
        todosEl.append(todoEl);
    }
    // be sure to give each todo an event listener
    toggleLoadingSpinner();
    // on click, complete that todo
}

// add an on load listener that fetches and displays todos on load
window.addEventListener('load', async () => {
    
    await displayTodos();
});

logoutButton.addEventListener('click', () => {
    logout();
});


deleteButton.addEventListener('click', async () => {
    // delete all todos
    await deleteAllTodos();
    // then refetch and display the updated list of todos
    displayTodos();
});
