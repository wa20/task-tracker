// Task Tracker JavaScript

class TaskTracker {

    constructor() {
        // Select DOM elements
        this.task = document.querySelector('#task-form');
        this.input = document.querySelector('#task-input');
        this.list = document.querySelectorAll('#task-list');
        this.filterButtons = document.querySelectorAll('#filter-buttons button');


        //state
        this.tasks = this.loadTasks();
        this.filter = "all";

        // bind handlers (KEY lesson: `this` binding)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleListClick = this.handleListClick.bind(this);
        this.handleFilterClick = this.handleFilterClick.bind(this);

        // attach event listeners
        this.form.addEventListener("submit", this.handleSubmit);
        this.list.addEventListener("click", this.handleListClick);
        this.filqterButtons.forEach(btn => btn, addEventListener("click", this.handleFilterClick));

        // Initial render
        this.render();
    }

    // Load tasks from localStorage
    loadTasks() {
        try {
            return JSON.parse(localStorage.getItem("tasks")) ?? [];
        } catch (error) {
            return [];
        }
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    // --- event handlers --- //

    handleSubmit(event) {
        event.preventDefault();
        const text = this.input.value.trim();
        if (!text) return;

        this.addTask(text);
        this.input.value = "";
        this.render()
    }

    handleListClick(event) {
        const toggleBtn = event.target.closest("[data-action='toggle']");
        const deleteBtn = event.target.closest("[data-action='delete']");
        const li = event.target.closest("li");

        if (!li) return;

        const id = li.dataset.id;

        if (toggleBtn) {
            this.toggleTask(id);
            this.render();
            return;
        }

        if (deleteBtn) {
            this.deleteTask(id);
            this.render();
            return;
        }
    }

    handleFilterClick(event) {
        this.tasks.unshift({
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now()
        });
        this.saveTasks();
    }

    // --- state updates --- //

    addTask(text) {
        this.tasks.unshift({
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now()
        });
        this.saveTasks();
    }

    toggleTask(id) {
        this.tasks - this.tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        this.saveTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id)
        this.saveTasks();
    }


    //--- derived state --- //

    getVisbileTasks() {
        if (this.filter === "active") {
            return this.tasks.filter(t => !t.completed);
        }

        if (this.filter === "completed") {
            return this.tasks.filter(t => t.completed);
        }
        return this.tasks;
    }


    render() {
        const visible - this.getVisbileTasks();;

        this.list.innerHtml = visible.map((listItem) => `
            <li data-id="${listItem.id}">
                <label style ="cursor:pointer">
                    <input type="checkbox" data-action="toggle" ${listItem.completed ? "checked" : ""} />
                    <span style="${listItem.completed ? "text-decoration: line-through" : ""}">
                        ${this.escapeHtml(listItem.text)}
                    </span>
                </label>
                <button data-action="delete" aria-label="Delete task">🗑️</button>
            </li>
            `
        ).join("");
    }

    // small security measure to prevent XSS
    escapeHtml(str) {
        return str.replace(/[&<>"']/g, m => (
            { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]
        ));
    }

}

new TaskTracker();
