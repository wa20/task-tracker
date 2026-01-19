// ============================================================================
// TASK TRACKER APPLICATION
// ============================================================================
// A simple task tracker built with JavaScript classes demonstrating:
//   - Object-Oriented Programming (OOP) with ES6 Classes
//   - DOM manipulation and event handling
//   - Local Storage for data persistence
//   - Array methods (map, filter, find)
//   - Closures, 'this' binding, and scope chain
//
// For detailed explanations of JavaScript concepts, load learning.js first!
// ============================================================================

console.log("📚 Script loaded! The Task Tracker is initializing...");

/**
 * TaskTracker Class
 * -----------------
  * A class is like a blueprint for creating objects. Think of it like a cookie cutter -
 * the class defines the shape, and each instance (created with 'new') is a cookie.
 * This class manages the entire task tracking application.
 */
class TaskTracker {

  /**
   * Constructor Method
   * ------------------
   * The constructor runs automatically when we create a new instance of the class.
   * It's where we set up our initial state and connect to the HTML elements.
   * 
   * Think of it like the "setup" phase of a board game - you need to:
   * 1. Get all the pieces ready (select DOM elements)
   * 2. Set the initial game state (load saved tasks)
   * 3. Make sure players know the rules (attach event listeners)
   */
  constructor() {
    console.log("🔧 Constructor running - setting up the TaskTracker...");

    // ========================================================================
    // STEP 1: SELECT DOM ELEMENTS
    // ========================================================================
    // DOM = Document Object Model - JavaScript's view of your HTML
    // querySelector uses CSS selectors: # for ID, . for class
    // ========================================================================
    
    this.form = document.querySelector("#task-form");
    this.input = document.querySelector("#task-input");
    this.list = document.querySelector("#task-list");
    this.filterButtons = document.querySelectorAll("[data-filter]");
    
    console.log("📋 DOM Elements found:");
    console.log("   - Form:", this.form);
    console.log("   - Input:", this.input);
    console.log("   - Task List:", this.list);
    console.log("   - Filter Buttons:", this.filterButtons);

    // ========================================================================
    // STEP 2: INITIALIZE STATE
    // ========================================================================
    // "State" = the data our app needs (tasks array + current filter)
    // ========================================================================
    
    this.tasks = this.loadTasks();
    this.filter = "all";
    
    console.log("📦 Initial state loaded:");
    console.log("   - Tasks:", this.tasks);
    console.log("   - Filter:", this.filter);

    // ========================================================================
    // STEP 3: BIND EVENT HANDLERS
    // ========================================================================
    // .bind(this) locks 'this' to our TaskTracker instance.
    // Without binding, 'this' in event handlers would be the DOM element!
    // 
    // See learning.js for detailed explanation of 'this' binding rules.
    // ========================================================================
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    
    console.log("🔗 Event handlers bound to 'this' context");

    // ========================================================================
    // STEP 4: ATTACH EVENT LISTENERS
    // ========================================================================
    // Pattern: element.addEventListener(eventType, handlerFunction)
    // ========================================================================
    
    this.form.addEventListener("submit", this.handleSubmit);
    this.list.addEventListener("click", this.handleListClick);
    
    // The arrow function here is a CLOSURE - it "closes over" 'this'
    this.filterButtons.forEach(btn =>
      btn.addEventListener("click", this.handleFilterClick)
    );
    
    console.log("👂 Event listeners attached");

    // ========================================================================
    // STEP 5: INITIAL RENDER
    // ========================================================================
    
    this.render();
    
    console.log("✅ TaskTracker is ready!");
  }

  // ==========================================================================
  // LOCAL STORAGE METHODS
  // ==========================================================================
  // localStorage is a browser feature that lets you save data that persists
  // even after the page is refreshed or the browser is closed.
  // 
  // Data in localStorage must be strings, so we use:
  //   - JSON.stringify() to convert objects/arrays to strings (for saving)
  //   - JSON.parse() to convert strings back to objects/arrays (for loading)
  // ==========================================================================

  /**
   * Load tasks from localStorage
   * @returns {Array} Array of task objects, or empty array if none saved
   */
  loadTasks() {
    console.log("💾 Loading tasks from localStorage...");
    
    try {
      const savedTasks = localStorage.getItem("tasks");
      const parsedTasks = JSON.parse(savedTasks) ?? [];  // ?? = nullish coalescing
      
      console.log("   - Found:", parsedTasks.length, "tasks");
      return parsedTasks;
    } catch (error) {
      console.warn("⚠️ Error loading tasks:", error);
      return [];
    }
  }

  /**
   * Save tasks to localStorage
   */
  saveTasks() {
    console.log("💾 Saving", this.tasks.length, "tasks to localStorage...");
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Handle form submission - adds a new task
   * @param {Event} event - The submit event
   */
  handleSubmit(event) {
    console.log("📝 Form submitted!");
    
    event.preventDefault();  // Prevent page refresh!
    
    const text = this.input.value.trim();
    console.log("   - Input value:", `"${text}"`);
    
    if (!text) {
      console.log("   - Empty input, ignoring");
      return;
    }

    this.addTask(text);
    this.input.value = "";  // Clear input
    this.render();
    
    console.log("   - Task added!");
  }

  /**
   * Handle clicks on the task list - uses Event Delegation
   * Instead of listeners on each button, ONE listener on the parent.
   * @param {Event} event - The click event
   */
  handleListClick(event) {
    console.log("🖱️ Click in task list:", event.target.tagName);
    
    // .closest() finds the nearest matching ancestor (or self)
    const toggleBtn = event.target.closest("[data-action='toggle']");
    const deleteBtn = event.target.closest("[data-action='delete']");
    const li = event.target.closest("li");

    if (!li) return;

    const id = li.dataset.id;
    console.log("   - Task ID:", id);

    if (toggleBtn) {
      console.log("   - Toggling task");
      this.toggleTask(id);
      this.render();
      return;
    }

    if (deleteBtn) {
      console.log("   - Deleting task");
      this.deleteTask(id);
      this.render();
      return;
    }
  }

  /**
   * Handle filter button clicks
   * @param {Event} event - The click event
   */
  handleFilterClick(event) {
    const btn = event.target.closest("[data-filter]");
    if (!btn) return;
    
    const newFilter = btn.dataset.filter;
    console.log("🔍 Filter changed:", this.filter, "→", newFilter);
    
    this.filter = newFilter;
    this.render();
  }

  // ==========================================================================
  // STATE UPDATE METHODS
  // ==========================================================================

  /**
   * Add a new task to the beginning of the array
   * @param {string} text - The task description
   */
  addTask(text) {
    const newTask = {
      id: crypto.randomUUID(),  // Generates unique ID
      text,                     // Shorthand for text: text
      completed: false,
      createdAt: Date.now()     // Timestamp in ms
    };
    
    console.log("➕ Adding task:", newTask.text);
    
    this.tasks.unshift(newTask);  // Add to beginning
    this.saveTasks();
  }

  /**
   * Toggle a task's completed status
   * @param {string} id - The task ID to toggle
   * 
   * Uses .map() to create a new array with the modified task.
   * The arrow function is a CLOSURE - it closes over 'id'.
   */
  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    console.log("🔄 Toggling:", task?.text, "→", !task?.completed);
    
    // Spread operator (...t) copies properties, then we override 'completed'
    this.tasks = this.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    
    this.saveTasks();
  }

  /**
   * Delete a task from the array
   * @param {string} id - The task ID to delete
   * 
   * Uses .filter() to keep only tasks that DON'T match the ID.
   */
  deleteTask(id) {
    const task = this.tasks.find(t => t.id === id);
    console.log("🗑️ Deleting:", task?.text);
    
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
  }

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================

  /**
   * Get tasks that should be visible based on current filter
   * @returns {Array} Filtered array of tasks
   */
  getVisibleTasks() {
    if (this.filter === "active") {
      return this.tasks.filter(t => !t.completed);
    }
    if (this.filter === "completed") {
      return this.tasks.filter(t => t.completed);
    }
    return this.tasks;  // "all"
  }

  // ==========================================================================
  // RENDER METHOD
  // ==========================================================================

  /**
   * Render the task list to the DOM
   * Uses template literals (backticks) to build HTML strings.
   */
  render() {
    console.log("🎨 Rendering...");
    
    const visible = this.getVisibleTasks();
    console.log("   - Showing", visible.length, "of", this.tasks.length, "tasks");

    // .map() + arrow function - the arrow inherits 'this' from render()
    const htmlContent = visible.map((task) => `
      <li data-id="${task.id}" class="${task.completed ? 'completed' : ''}">
        <label style="cursor:pointer">
          <input 
            type="checkbox" 
            data-action="toggle" 
            ${task.completed ? "checked" : ""} 
          />
          <span style="${task.completed ? "text-decoration: line-through; opacity: 0.6;" : ""}">
            ${this.escapeHtml(task.text)}
          </span>
        </label>
        <button data-action="delete" aria-label="Delete task">🗑️</button>
      </li>
    `).join("");

    // Update DOM - note: it's innerHTML (capital H)!
    this.list.innerHTML = htmlContent;
    
    // Update active filter button
    this.filterButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === this.filter);
    });
  }

  // ==========================================================================
  // SECURITY HELPER
  // ==========================================================================

  /**
   * Escape HTML to prevent XSS (Cross-Site Scripting) attacks
   * Converts < > & " ' to safe HTML entities.
   * @param {string} str - The string to escape
   * @returns {string} Safe string for HTML insertion
   */
  escapeHtml(str) {
    return str.replace(/[&<>"']/g, match => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[match]));
  }

}

// ============================================================================
// CREATE THE APPLICATION
// ============================================================================

console.log("🚀 Creating TaskTracker instance...");
const taskTracker = new TaskTracker();

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

console.log("");
console.log("=".repeat(50));
console.log("🧪 Debug commands (try in console):");
console.log("=".repeat(50));
console.log("• taskTracker.tasks      - View all tasks");
console.log("• taskTracker.filter     - Current filter");
console.log("• taskTracker.addTask('Test') - Add task");
console.log("• taskTracker.render()   - Force re-render");
console.log("• localStorage.clear()   - Clear saved data");
console.log("=".repeat(50));

// Check if learning.js is loaded
if (window.learningExamples) {
  console.log("");
  console.log("📚 Learning mode is active!");
  console.log("   Try: learningExamples.closureDemo()");
}

console.log("");
