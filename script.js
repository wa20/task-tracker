// ============================================================================
// TASK TRACKER APPLICATION
// ============================================================================
// This is a simple task tracker built using JavaScript classes.
// It demonstrates key concepts like:
//   - Object-Oriented Programming (OOP) with ES6 Classes
//   - DOM manipulation (selecting and modifying HTML elements)
//   - Event handling (responding to user actions like clicks)
//   - Local Storage (saving data in the browser)
//   - Array methods (map, filter, find)
// ============================================================================

console.log("📚 Script loaded! The Task Tracker is initializing...");

/**
 * TaskTracker Class
 * -----------------
 * A class is like a blueprint for creating objects. Think of it like a cookie cutter -
 * the class defines the shape, and each instance (created with 'new') is a cookie.
 * 
 * This class manages our entire task tracking application:
 *   - Stores tasks in memory and in localStorage
 *   - Handles user interactions (adding, completing, deleting tasks)
 *   - Renders the task list to the screen
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
    // DOM = Document Object Model - it's how JavaScript sees your HTML
    // We use document.querySelector() to find elements by their CSS selectors
    // The # symbol means we're looking for an ID (e.g., id="task-form")
    // ========================================================================
    
    this.form = document.querySelector("#task-form");
    this.input = document.querySelector("#task-input");
    this.list = document.querySelector("#task-list");
    this.filterButtons = document.querySelectorAll("[data-filter]");
    
    // Let's log what we found to make sure everything is connected
    console.log("📋 DOM Elements found:");
    console.log("   - Form:", this.form);
    console.log("   - Input:", this.input);
    console.log("   - Task List:", this.list);
    console.log("   - Filter Buttons:", this.filterButtons);

    // ========================================================================
    // STEP 2: INITIALIZE STATE
    // ========================================================================
    // "State" is the data that our application needs to work.
    // In this case, our state is:
    //   - tasks: an array of task objects
    //   - filter: which tasks to show ("all", "active", or "completed")
    // ========================================================================
    
    this.tasks = this.loadTasks();
    this.filter = "all";
    
    console.log("📦 Initial state loaded:");
    console.log("   - Tasks:", this.tasks);
    console.log("   - Filter:", this.filter);

    // ========================================================================
    // STEP 3: BIND EVENT HANDLERS
    // ========================================================================
    // This is a CRUCIAL JavaScript concept!
    // 
    // When you pass a method as a callback (like for addEventListener),
    // the 'this' keyword gets confused and won't point to our class anymore.
    // 
    // .bind(this) creates a new function where 'this' is permanently set
    // to our TaskTracker instance.
    // 
    // Without binding: 'this' would refer to the clicked button or form
    // With binding: 'this' refers to our TaskTracker class instance
    // ========================================================================
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    
    console.log("🔗 Event handlers bound to 'this' context");

    // ========================================================================
    // STEP 4: ATTACH EVENT LISTENERS
    // ========================================================================
    // Event listeners are how we respond to user actions.
    // The pattern is: element.addEventListener(eventType, handlerFunction)
    // 
    // Common event types:
    //   - "click" - when something is clicked
    //   - "submit" - when a form is submitted
    //   - "input" - when text is typed
    //   - "keydown" - when a key is pressed
    // ========================================================================
    
    this.form.addEventListener("submit", this.handleSubmit);
    this.list.addEventListener("click", this.handleListClick);
    
    // For multiple elements, we use forEach to loop through each one
    this.filterButtons.forEach(btn =>
      btn.addEventListener("click", this.handleFilterClick)
    );
    
    console.log("👂 Event listeners attached to form, list, and filter buttons");

    // ========================================================================
    // STEP 5: INITIAL RENDER
    // ========================================================================
    // "Rendering" means taking our data and displaying it on the page.
    // We call render() now to show any tasks that were saved previously.
    // ========================================================================
    
    this.render();
    
    console.log("✅ TaskTracker is ready to use!");
    console.log("💡 Tip: Try adding a task using the form above!");
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
   * 
   * The ?? operator is the "nullish coalescing operator":
   * If the left side is null or undefined, use the right side instead.
   * So if there are no saved tasks, we return an empty array [].
   */
  loadTasks() {
    console.log("💾 Loading tasks from localStorage...");
    
    try {
      const savedTasks = localStorage.getItem("tasks");
      const parsedTasks = JSON.parse(savedTasks) ?? [];
      
      console.log("   - Found saved data:", savedTasks);
      console.log("   - Parsed into:", parsedTasks);
      
      return parsedTasks;
    } catch (error) {
      // If something goes wrong (corrupted data), return empty array
      console.warn("⚠️ Error loading tasks, starting fresh:", error);
      return [];
    }
  }

  /**
   * Save tasks to localStorage
   * 
   * This is called every time we add, toggle, or delete a task
   * to make sure our data is always saved.
   */
  saveTasks() {
    console.log("💾 Saving tasks to localStorage...");
    console.log("   - Saving:", this.tasks);
    
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    
    console.log("   - Saved successfully!");
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  // These methods are called when the user interacts with the page.
  // They connect user actions to our data operations.
  // ==========================================================================

  /**
   * Handle form submission (when user adds a new task)
   * 
   * @param {Event} event - The submit event object
   * 
   * event.preventDefault() stops the form from doing its default behavior
   * (which would refresh the page and lose all our JavaScript state!)
   */
  handleSubmit(event) {
    console.log("📝 Form submitted!");
    
    // Prevent the default form behavior (page refresh)
    event.preventDefault();
    
    // Get the input value and remove whitespace from start/end
    const text = this.input.value.trim();
    
    console.log("   - Input value:", `"${text}"`);
    
    // If the input is empty, don't do anything
    if (!text) {
      console.log("   - Empty input, ignoring submission");
      return;
    }

    // Add the new task
    this.addTask(text);
    
    // Clear the input field so user can type a new task
    this.input.value = "";
    
    // Re-render to show the new task
    this.render();
    
    console.log("   - Task added and rendered!");
  }

  /**
   * Handle clicks on the task list (toggle or delete)
   * 
   * This uses "Event Delegation" - instead of attaching a listener to each
   * button individually, we attach ONE listener to the parent (the list)
   * and figure out which button was clicked.
   * 
   * Benefits of event delegation:
   *   - Better performance (fewer event listeners)
   *   - Works for dynamically added elements (new tasks)
   * 
   * @param {Event} event - The click event object
   */
  handleListClick(event) {
    console.log("🖱️ Click detected in task list!");
    console.log("   - Clicked element:", event.target);
    
    // .closest() finds the nearest ancestor (or self) matching the selector
    // It's useful for finding which button/element was actually clicked
    const toggleBtn = event.target.closest("[data-action='toggle']");
    const deleteBtn = event.target.closest("[data-action='delete']");
    const li = event.target.closest("li");

    // If click wasn't inside a list item, ignore it
    if (!li) {
      console.log("   - Click was outside a task item, ignoring");
      return;
    }

    // Get the task ID from the data attribute on the <li>
    const id = li.dataset.id;
    console.log("   - Task ID:", id);

    // Check if toggle checkbox was clicked
    if (toggleBtn) {
      console.log("   - Toggle button clicked!");
      this.toggleTask(id);
      this.render();
      return;
    }

    // Check if delete button was clicked
    if (deleteBtn) {
      console.log("   - Delete button clicked!");
      this.deleteTask(id);
      this.render();
      return;
    }
    
    console.log("   - Click was not on a toggle or delete button");
  }

  /**
   * Handle filter button clicks
   * 
   * @param {Event} event - The click event object
   */
  handleFilterClick(event) {
    // Find the button that was clicked
    const btn = event.target.closest("[data-filter]");
    
    if (!btn) return;
    
    // Get the filter value from the data-filter attribute
    const newFilter = btn.dataset.filter;
    
    console.log("🔍 Filter changed!");
    console.log("   - Previous filter:", this.filter);
    console.log("   - New filter:", newFilter);
    
    this.filter = newFilter;
    this.render();
  }

  // ==========================================================================
  // STATE UPDATE METHODS
  // ==========================================================================
  // These methods modify our tasks array.
  // Each one also saves to localStorage to persist changes.
  // ==========================================================================

  /**
   * Add a new task
   * 
   * @param {string} text - The task description
   * 
   * unshift() adds to the BEGINNING of an array (newest tasks first)
   * push() would add to the END of an array
   * 
   * crypto.randomUUID() generates a unique ID like:
   * "550e8400-e29b-41d4-a716-446655440000"
   */
  addTask(text) {
    const newTask = {
      id: crypto.randomUUID(),  // Unique identifier for this task
      text,                     // The task description (shorthand for text: text)
      completed: false,         // New tasks start as not completed
      createdAt: Date.now()     // Timestamp in milliseconds
    };
    
    console.log("➕ Adding new task:");
    console.log("   - Task object:", newTask);
    
    // Add to beginning of array
    this.tasks.unshift(newTask);
    
    // Save to localStorage
    this.saveTasks();
    
    console.log("   - Total tasks now:", this.tasks.length);
  }

  /**
   * Toggle a task's completed status
   * 
   * @param {string} id - The ID of the task to toggle
   * 
   * We use .map() to create a new array. For the matching task,
   * we create a new object with the completed value flipped.
   * 
   * The spread operator (...t) copies all properties from the original task.
   * Then we override just the 'completed' property.
   */
  toggleTask(id) {
    console.log("🔄 Toggling task:", id);
    
    // Find the current state of the task (for logging)
    const taskBefore = this.tasks.find(t => t.id === id);
    console.log("   - Before:", taskBefore?.completed ? "completed" : "active");
    
    // Create new array with the toggled task
    this.tasks = this.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    
    // Find the new state (for logging)
    const taskAfter = this.tasks.find(t => t.id === id);
    console.log("   - After:", taskAfter?.completed ? "completed" : "active");
    
    this.saveTasks();
  }

  /**
   * Delete a task
   * 
   * @param {string} id - The ID of the task to delete
   * 
   * We use .filter() to create a new array containing only the tasks
   * whose ID does NOT match the one we want to delete.
   */
  deleteTask(id) {
    console.log("🗑️ Deleting task:", id);
    
    const taskToDelete = this.tasks.find(t => t.id === id);
    console.log("   - Deleting:", taskToDelete?.text);
    console.log("   - Tasks before:", this.tasks.length);
    
    // Keep all tasks EXCEPT the one with matching ID
    this.tasks = this.tasks.filter(t => t.id !== id);
    
    console.log("   - Tasks after:", this.tasks.length);
    
    this.saveTasks();
  }

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================
  // "Derived state" is data we calculate from our main state.
  // Instead of storing filtered tasks separately, we calculate them on demand.
  // ==========================================================================

  /**
   * Get the tasks that should be visible based on current filter
   * 
   * @returns {Array} The filtered array of tasks
   */
  getVisibleTasks() {
    console.log("👁️ Getting visible tasks for filter:", this.filter);
    
    let visibleTasks;
    
    if (this.filter === "active") {
      // Show only tasks that are NOT completed
      visibleTasks = this.tasks.filter(t => !t.completed);
    } else if (this.filter === "completed") {
      // Show only tasks that ARE completed
      visibleTasks = this.tasks.filter(t => t.completed);
    } else {
      // "all" - show everything
      visibleTasks = this.tasks;
    }
    
    console.log("   - Total tasks:", this.tasks.length);
    console.log("   - Visible tasks:", visibleTasks.length);
    
    return visibleTasks;
  }

  // ==========================================================================
  // RENDER METHOD
  // ==========================================================================
  // The render method updates what the user sees on the page.
  // It takes our data and converts it to HTML.
  // ==========================================================================

  /**
   * Render the task list to the DOM
   * 
   * We use template literals (backticks ` `) to create HTML strings.
   * ${variable} inside template literals lets us insert JavaScript values.
   * 
   * The .map() creates an array of HTML strings, one for each task.
   * The .join("") combines them into one big string.
   */
  render() {
    console.log("🎨 Rendering task list...");
    
    // Get the tasks that should be displayed
    const visible = this.getVisibleTasks();

    // Generate HTML for each task and combine into one string
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

    // Update the DOM
    // IMPORTANT: It's innerHTML (capital H), not innerHtml!
    this.list.innerHTML = htmlContent;
    
    console.log("   - Rendered", visible.length, "tasks");
    
    // Update filter button styles to show which is active
    this.filterButtons.forEach(btn => {
      if (btn.dataset.filter === this.filter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    
    console.log("   - Filter buttons updated");
  }

  // ==========================================================================
  // SECURITY HELPER
  // ==========================================================================

  /**
   * Escape HTML special characters to prevent XSS attacks
   * 
   * XSS (Cross-Site Scripting) is when malicious code gets injected into a page.
   * For example, if a user types "<script>alert('hacked!')</script>" as a task,
   * without escaping, that script would actually run!
   * 
   * By replacing < with &lt; etc., we ensure the text is displayed as text,
   * not executed as HTML/JavaScript.
   * 
   * @param {string} str - The string to escape
   * @returns {string} The escaped string, safe to insert as HTML
   */
  escapeHtml(str) {
    const escaped = str.replace(/[&<>"']/g, match => ({
      "&": "&amp;",   // & must be escaped first!
      "<": "&lt;",    // < starts HTML tags
      ">": "&gt;",    // > ends HTML tags
      '"': "&quot;",  // " can break out of attributes
      "'": "&#39;"    // ' can also break out of attributes
    }[match]));
    
    // Only log if we actually escaped something
    if (escaped !== str) {
      console.log("🛡️ Escaped HTML characters:");
      console.log("   - Before:", str);
      console.log("   - After:", escaped);
    }
    
    return escaped;
  }

}

// ============================================================================
// CREATE THE APPLICATION INSTANCE
// ============================================================================
// This line creates a new TaskTracker object, which runs the constructor
// and starts the whole application!
// 
// We could also do: const app = new TaskTracker();
// to keep a reference to the instance for debugging in the console.
// ============================================================================

console.log("🚀 Creating TaskTracker instance...");
const taskTracker = new TaskTracker();

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================
// These make it easy to inspect and test the app from the browser console.
// Open DevTools (F12 or Cmd+Option+I) and try these commands!
// ============================================================================

console.log("");
console.log("=".repeat(60));
console.log("🧪 DEBUGGING TIPS - Try these in the console:");
console.log("=".repeat(60));
console.log("• taskTracker.tasks          - View all tasks");
console.log("• taskTracker.filter         - View current filter");
console.log("• taskTracker.addTask('Test') - Add a task programmatically");
console.log("• taskTracker.render()       - Force re-render");
console.log("• localStorage.getItem('tasks') - View raw saved data");
console.log("• localStorage.clear()       - Clear all saved tasks");
console.log("=".repeat(60));
console.log("");
