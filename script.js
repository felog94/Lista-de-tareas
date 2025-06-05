// --- Referencias a los elementos del DOM ---
const newTaskInput = document.getElementById('new-task-text');
const newTaskCategorySelect = document.getElementById('new-task-category');
const newTaskPrioritySelect = document.getElementById('new-task-priority');
const newTaskDueDateInput = document.getElementById('new-task-due-date');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListUl = document.getElementById('task-list');
const showAllBtn = document.getElementById('show-all-btn');
const showPendingBtn = document.getElementById('show-pending-btn');
const showCompletedBtn = document.getElementById('show-completed-btn');
const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
const languageSelect = document.getElementById('language-select'); // Referencia al selector de idioma

// --- Array para almacenar las tareas (nuestro "estado") ---
let tasks = [];

// --- DICCIONARIO DE TRADUCCIONES ---
const translations = {
    es: {
        appTitle: 'Mi Lista de Tareas',
        mainHeading: 'Mi Lista de Tareas',
        selectLanguage: 'Seleccionar Idioma:',
        newTaskPlaceholder: 'Añadir nueva tarea...',
        addTaskButton: 'Añadir Tarea',
        filterAll: 'Todas',
        filterPending: 'Pendientes',
        filterCompleted: 'Completadas',
        darkModeButton: 'Modo Oscuro/Claro',
        taskTextPlaceholder: 'Por favor, ingresa una tarea.', // Para el alert
        catPersonal: 'Personal',
        catWork: 'Trabajo',
        catShopping: 'Compras',
        catHealth: 'Salud',
        prioLow: 'Baja',
        prioMedium: 'Media',
        prioHigh: 'Alta',
        noDueDate: 'Sin fecha',
        priorityLabel: 'Prioridad:',
        categoryLabel: 'Categoría:',
        dateLabel: 'Fecha:',
        overdue: '(Vencida)',
        upcoming: '(Próxima)',
        deleteButton: 'Eliminar'
    },
    en: {
        appTitle: 'My To-Do List',
        mainHeading: 'My To-Do List',
        selectLanguage: 'Select Language:',
        newTaskPlaceholder: 'Add new task...',
        addTaskButton: 'Add Task',
        filterAll: 'All',
        filterPending: 'Pending',
        filterCompleted: 'Completed',
        darkModeButton: 'Dark/Light Mode',
        taskTextPlaceholder: 'Please enter a task.',
        catPersonal: 'Personal',
        catWork: 'Work',
        catShopping: 'Shopping',
        catHealth: 'Health',
        prioLow: 'Low',
        prioMedium: 'Medium',
        prioHigh: 'High',
        noDueDate: 'No date',
        priorityLabel: 'Priority:',
        categoryLabel: 'Category:',
        dateLabel: 'Date:',
        overdue: '(Overdue)',
        upcoming: '(Upcoming)',
        deleteButton: 'Delete'
    }
};

// Cargar idioma preferido del localStorage. 'es' por defecto
let currentLanguage = localStorage.getItem('language') || 'es';

// --- Traducir la interfaz ---
function translateUI() {
    // Traducir elementos con data-i18n o data-i18n-placeholder
    const elementsToTranslate = document.querySelectorAll('[data-i18n], [data-i18n-placeholder]');
    elementsToTranslate.forEach(element => {
        const key = element.dataset.i18n || element.dataset.i18nPlaceholder;
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.dataset.i18nPlaceholder) {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });

    // Actualizar las opciones de los selects de categoría y prioridad
    const categoryOptions = newTaskCategorySelect.querySelectorAll('option');
    categoryOptions.forEach(option => {
        const key = option.dataset.i18n;
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            option.textContent = translations[currentLanguage][key];
        }
    });

    const priorityOptions = newTaskPrioritySelect.querySelectorAll('option');
    priorityOptions.forEach(option => {
        const key = option.dataset.i18n;
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            option.textContent = translations[currentLanguage][key];
        }
    });

    // Actualizar el título de la página
    document.title = translations[currentLanguage].appTitle;
    // Asegurarse de que el selector muestre el idioma actual
    languageSelect.value = currentLanguage;
    // Actualizar el atributo lang del elemento <html>
    document.documentElement.lang = currentLanguage;

    // Volver a renderizar las tareas para que se traduzcan los detalles internos
    renderTasks();
}


// --- Funciones de Persistencia (localStorage) ---
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// --- Función para Renderizar Tareas (MODIFICADA para traducción) ---
function renderTasks(filter = 'all') {
    taskListUl.innerHTML = ''; // Limpiar la lista antes de volver a renderizar

    let filteredTasks = tasks;
    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        if (task.completed) {
            listItem.classList.add('completed');
        }

        const now = new Date();
        const dueDate = new Date(task.dueDate);
        let dueDateClass = '';
        // Usar toLocaleString con el idioma actual para el formato de fecha
        let dueDateText = task.dueDate ? dueDate.toLocaleString(currentLanguage) : translations[currentLanguage].noDueDate;

        if (task.dueDate && !task.completed) { // Solo si no está completada
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Diferencia en días

            if (timeDiff < 0) {
                dueDateClass = 'overdue'; // Vencida
                dueDateText += ` ${translations[currentLanguage].overdue}`;
            } else if (daysDiff <= 2) {
                dueDateClass = 'upcoming'; // Próxima a vencer (2 días o menos)
                dueDateText += ` ${translations[currentLanguage].upcoming}`;
            }
        }

        // El texto de la categoría y prioridad en el span es el valor original,
        // pero la etiqueta antes usa la traducción.
        const translatedCategory = translations[currentLanguage][`cat${task.category.charAt(0).toUpperCase() + task.category.slice(1)}`] || task.category;
        const translatedPriority = translations[currentLanguage][`prio${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`] || task.priority;

        listItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${task.text}</span>
            <div class="task-meta">
                <span>${translations[currentLanguage].categoryLabel} ${translatedCategory}</span>
                <span class="priority-label ${task.priority}">${translations[currentLanguage].priorityLabel} ${translatedPriority}</span>
                <span class="due-date ${dueDateClass}">${translations[currentLanguage].dateLabel} ${dueDateText}</span>
            </div>
            <button class="delete-btn" data-id="${task.id}">${translations[currentLanguage].deleteButton}</button>
        `;
        taskListUl.appendChild(listItem);
    });
}

// --- Función para Añadir Tarea (MODIFICADA para alerta) ---
function addTask() {
    const text = newTaskInput.value.trim();
    const category = newTaskCategorySelect.value;
    const priority = newTaskPrioritySelect.value;
    const dueDate = newTaskDueDateInput.value;

    if (text === '') {
        alert(translations[currentLanguage].taskTextPlaceholder); // Alerta traducida
        return;
    }

    const newTask = {
        id: Date.now(), // ID único basado en el timestamp
        text: text,
        completed: false,
        category: category,
        priority: priority,
        dueDate: dueDate
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks(); // Renderiza las tareas actuales
    newTaskInput.value = ''; // Limpiar el input
    newTaskDueDateInput.value = ''; // Limpiar la fecha
}

// --- Función para Manejar Clicks en la Lista (Delegación de Eventos) ---
function handleTaskClicks(event) {
    const target = event.target;

    // Marcar como completada
    if (target.type === 'checkbox') {
        const taskId = parseInt(target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = target.checked;
            saveTasks();
            renderTasks(); // Vuelve a renderizar para actualizar el estilo y el filtro si aplica
        }
    }

    // Eliminar tarea
    if (target.classList.contains('delete-btn')) {
        const taskId = parseInt(target.dataset.id);
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

// --- Lógica del Modo Oscuro/Claro ---
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode); // Guardar preferencia
}

function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// --- Cambiar Idioma ---
function changeLanguage() {
    currentLanguage = languageSelect.value;
    localStorage.setItem('language', currentLanguage); // Guardar preferencia
    translateUI(); // Volver a traducir toda la interfaz
}


// --- Event Listeners ---
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
taskListUl.addEventListener('click', handleTaskClicks);

showAllBtn.addEventListener('click', () => renderTasks('all'));
showPendingBtn.addEventListener('click', () => renderTasks('pending'));
showCompletedBtn.addEventListener('click', () => renderTasks('completed'));

toggleDarkModeBtn.addEventListener('click', toggleDarkMode);

languageSelect.addEventListener('change', changeLanguage); // Listener para el cambio de idioma


// --- Carga Inicial al Abrir la Página ---
document.addEventListener('DOMContentLoaded', () => {
    loadDarkModePreference(); // Cargar la preferencia de modo oscuro primero
    loadTasks(); // Cargar las tareas guardadas
    translateUI(); // Luego traducir la UI, que también llama a renderTasks()
});