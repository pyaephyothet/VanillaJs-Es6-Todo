
const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodoBtn');
const todoList = document.querySelector('#todoList');
const allFilterBtn = document.querySelector('#allFilterBtn');
const activeFilterBtn = document.querySelector('#activeFilterBtn');
const completedFilterBtn = document.querySelector('#completedFilterBtn');
const checkAllBtn = document.querySelector('#checkAllBtn');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');

addTodoBtn.addEventListener('click', e => {
    e.preventDefault();
    addTodo();
});

allFilterBtn.addEventListener('click', () => {
    allFilterBtn.classList.add('active');
    activeFilterBtn.classList.remove('active');
    completedFilterBtn.classList.remove('active');
    updateTodos();
});

activeFilterBtn.addEventListener('click', () => {
    allFilterBtn.classList.remove('active');
    activeFilterBtn.classList.add('active');
    completedFilterBtn.classList.remove('active');
    updateTodos();
});

completedFilterBtn.addEventListener('click', () => {
    allFilterBtn.classList.remove('active');
    activeFilterBtn.classList.remove('active');
    completedFilterBtn.classList.add('active');
    updateTodos();
});

checkAllBtn.addEventListener('click', () => {
    if (checkAllBtn.innerText.toLowerCase() == "check all") {
        checkAllBtn.innerText = "Unheck All";
        checkAll();
    } else {
        checkAllBtn.innerText = "Check All";
        checkAll();
    }

});

clearCompletedBtn.addEventListener('click', () => {
    clearCompleted();
});



let todos = [];

// Load todos from local storage
if (localStorage.getItem('todos')) {
    todos = JSON.parse(localStorage.getItem('todos'));
    updateTodos();
}


function addTodo() {
    if (todoInput.value !== '') {
        const todo = {
            id: Date.now(),
            text: todoInput.value,
            completed: false
        };
        todos.push(todo);
        updateTodos();
        todoInput.value = '';
        saveTodos();
    }
}


function updateTodos() {

    todoList.innerHTML = '';


    const filter = getFilter();
    const filteredTodos = todos.filter(todo => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'active') {
            return !todo.completed;
        } else if (filter === 'completed') {
            return todo.completed;
        }
    });


    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('click', () => {
            toggleTodoCompleted(todo.id);
        });
        const span = document.createElement('input');
        span.type = 'text';
        span.readOnly = 'readonly';
        span.value = todo.text;
        span.addEventListener('dblclick', function () {
            span.removeAttribute("readonly");
            span.classList.add('focus-style');
            span.focus();

            span.addEventListener("keydown", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    span.blur();
                }
            });

            span.addEventListener("blur", function () {
                span.classList.remove('focus-style');
                let value = span.value;
                console.log(value);
                edit(value, todo.id);
                span.setAttribute('readonly', 'readonly');
            });
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `<i class="bi bi-trash3"></i>`;
        deleteBtn.addEventListener('click', () => {
            deleteTodoById(todo.id);
        });
        li.classList.add("task");
        span.classList.add("todo-item");
        deleteBtn.classList.add("trash-btn");
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);

        // Save todos to local storage
        saveTodos();

    });

    function edit(value, id) {
        todos = todos.map(todo => {
            if (todo.id === id && value !== '') {
                return {
                    ...todo,
                    text: value
                };

            } else {
                return todo;
            }
        });
        updateTodos();
        saveTodos();
    }

    const activeCount = getActiveCount();

    const activeCountSpan = document.querySelector('#activeCount');
    activeCountSpan.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;


    if (todos.length > 0) {
        checkAllBtn.disabled = false;
    } else {
        checkAllBtn.disabled = true;
    }

    const completedTodos = todos.filter(todo => todo.completed);
    if (completedTodos.length > 0) {
        clearCompletedBtn.disabled = false;
    } else {
        clearCompletedBtn.disabled = true;
    }
}


function getFilter() {
    if (allFilterBtn.classList.contains('active')) {
        return 'all';
    } else if (activeFilterBtn.classList.contains('active')) {
        return 'active';
    } else if (completedFilterBtn.classList.contains('active')) {
        return 'completed';
    }
}


function toggleTodoCompleted(id) {

    todos = todos.map(todo => {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed
            };

        } else {
            return todo;
        }
    });
    updateTodos();
}


function deleteTodoById(id) {
    todos = todos.filter(todo => todo.id !== id);
    updateTodos();
    saveTodos();
}


function checkAll() {
    const allCompleted = todos.every(todo => todo.completed);
    todos = todos.map(todo => {
        return {
            ...todo,
            completed: !allCompleted
        };
    });
    updateTodos();
}


function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    updateTodos();
    saveTodos();
}

function getActiveCount() {
    const activeTodos = todos.filter(todo => !todo.completed);
    return activeTodos.length;
}
// Save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

updateTodos();

