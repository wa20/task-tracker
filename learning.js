// ############################################################################
// ############################################################################
// ##                                                                        ##
// ##                    JAVASCRIPT FUNDAMENTALS GUIDE                       ##
// ##                                                                        ##
// ##  This file contains educational content about JavaScript concepts.     ##
// ##  Load this file BEFORE script.js to see demos run on page load.        ##
// ##                                                                        ##
// ############################################################################
// ############################################################################

console.log("📚 Learning Mode Active! Educational demos will run first.");
console.log("");

// ============================================================================
// 1. EXECUTION CONTEXT & CALL STACK
// ============================================================================
//
// When JavaScript runs your code, it creates "Execution Contexts" - think of
// them as boxes that contain everything needed to run a piece of code.
//
// There are 3 types of Execution Contexts:
//   1. Global Execution Context (GEC) - Created when your script first runs
//   2. Function Execution Context (FEC) - Created each time a function is called
//   3. Eval Execution Context - Created by eval() (rarely used)
//
// THE CALL STACK:
// ---------------
// The Call Stack is like a stack of plates - Last In, First Out (LIFO).
// When a function is called, it's pushed onto the stack.
// When it returns, it's popped off the stack.
//
// Example:
//   function first() { second(); }
//   function second() { third(); }
//   function third() { console.log("Hi!"); }
//   first();
//
// Call Stack visualization:
//   [empty]           → first() called
//   [first]           → second() called  
//   [first, second]   → third() called
//   [first, second, third] → console.log runs
//   [first, second]   → third() returns
//   [first]           → second() returns
//   [empty]           → first() returns
//
// You can see the Call Stack in DevTools:
//   1. Add a breakpoint or use debugger; statement
//   2. Check the "Call Stack" panel when code pauses
//
// ============================================================================

console.log("📖 EXECUTION CONTEXT DEMO:");
console.log("   Currently in: Global Execution Context");

function demonstrateCallStack() {
  console.log("   Called: demonstrateCallStack() - new context pushed to stack");
  
  function innerFunction() {
    console.log("   Called: innerFunction() - another context pushed");
    console.log("   Call Stack now: [Global, demonstrateCallStack, innerFunction]");
    // When this function ends, innerFunction is popped off the stack
  }
  
  innerFunction();
  console.log("   innerFunction returned - popped off stack");
  // When this function ends, demonstrateCallStack is popped off
}

demonstrateCallStack();
console.log("   demonstrateCallStack returned - back to Global context only");
console.log("");

// ============================================================================
// 2. SCOPE & SCOPE CHAIN
// ============================================================================
//
// SCOPE determines where variables can be accessed in your code.
//
// Types of Scope:
//   1. Global Scope - Variables declared outside any function/block
//   2. Function Scope - Variables declared inside a function (var, let, const)
//   3. Block Scope - Variables declared inside {} with let/const (not var!)
//
// THE SCOPE CHAIN:
// ----------------
// When JavaScript looks for a variable, it searches in this order:
//   1. Current scope (local)
//   2. Outer function scope (if nested)
//   3. ... continues outward ...
//   4. Global scope
//   5. If not found anywhere → ReferenceError
//
// This chain of scopes is called the "Scope Chain" - it's like a ladder
// that JavaScript climbs, looking for the variable at each level.
//
// IMPORTANT: The Scope Chain is determined at CREATION time (lexically),
// not at execution time. This is called "Lexical Scoping".
//
// ============================================================================

console.log("📖 SCOPE CHAIN DEMO:");

const globalVar = "I'm global!";

function outerFunction() {
  const outerVar = "I'm in outer function!";
  
  function middleFunction() {
    const middleVar = "I'm in middle function!";
    
    function innerFunction() {
      const innerVar = "I'm in inner function!";
      
      // This function can access ALL variables in the scope chain:
      console.log("   Inner accessing innerVar:", innerVar);    // Own scope
      console.log("   Inner accessing middleVar:", middleVar);  // Parent scope
      console.log("   Inner accessing outerVar:", outerVar);    // Grandparent scope
      console.log("   Inner accessing globalVar:", globalVar);  // Global scope
    }
    
    innerFunction();
  }
  
  middleFunction();
  // console.log(middleVar); // ❌ ERROR! Can't access child's scope
}

outerFunction();
// console.log(outerVar); // ❌ ERROR! Can't access function's local scope
console.log("");

// ============================================================================
// 3. CLOSURES
// ============================================================================
//
// A CLOSURE is created when a function "remembers" variables from its
// outer scope, even after the outer function has finished executing.
//
// Think of it like this:
//   - A function is created inside another function
//   - The inner function uses variables from the outer function
//   - The outer function returns the inner function (or passes it somewhere)
//   - The inner function still has access to those outer variables!
//
// WHY? Because the inner function keeps a reference to its scope chain.
// The outer variables are "closed over" - hence "closure".
//
// This is one of the most POWERFUL features of JavaScript!
//
// Common use cases:
//   - Data privacy (creating private variables)
//   - Factory functions (creating functions with preset values)
//   - Event handlers (remembering context when handler runs later)
//   - Callbacks (remembering state when async operation completes)
//
// ============================================================================

console.log("📖 CLOSURE DEMO:");

// Example 1: Counter Factory (demonstrates data privacy)
function createCounter() {
  // This variable is PRIVATE - no one can access it directly
  let count = 0;
  
  // This returned function is a CLOSURE - it "closes over" count
  return function increment() {
    count += 1;
    console.log(`   Counter value: ${count}`);
    return count;
  };
}

const counter1 = createCounter();  // Creates a new closure with its own 'count'
const counter2 = createCounter();  // Creates ANOTHER closure with a SEPARATE 'count'

console.log("   Counter 1:");
counter1();  // 1
counter1();  // 2
counter1();  // 3

console.log("   Counter 2 (separate count!):");
counter2();  // 1 - This is independent from counter1!

console.log("   Back to Counter 1:");
counter1();  // 4 - Remembers its own count

// Example 2: Function Factory
function createMultiplier(multiplier) {
  // The returned function "closes over" the multiplier parameter
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("   double(5):", double(5));  // 10
console.log("   triple(5):", triple(5));  // 15

console.log("");

// ============================================================================
// 4. THE 'this' KEYWORD - BINDING RULES
// ============================================================================
//
// 'this' is a special keyword that refers to the "context" of execution.
// Its value is determined by HOW a function is called, not where it's defined.
//
// There are 4 BINDING RULES (in order of precedence):
//
// RULE 1: "new" Binding (Highest Priority)
// -----------------------------------------
// When a function is called with 'new', 'this' refers to the new object.
//   const obj = new Constructor();
//   // Inside Constructor, 'this' = the new object being created
//
// RULE 2: Explicit Binding
// ------------------------
// Using .call(), .apply(), or .bind() to set 'this' manually.
//   func.call(obj, arg1, arg2)   - Calls func with this=obj
//   func.apply(obj, [args])      - Same, but args as array
//   func.bind(obj)               - Returns NEW function with this=obj
//
// RULE 3: Implicit Binding
// ------------------------
// When a method is called on an object, 'this' = that object.
//   obj.method()  → inside method, this = obj
//   obj.nested.method()  → this = obj.nested (the immediate object)
//
// RULE 4: Default Binding (Lowest Priority)
// -----------------------------------------
// If none of the above apply:
//   - In strict mode: this = undefined
//   - In sloppy mode: this = globalThis (window in browsers)
//
// ARROW FUNCTIONS - SPECIAL CASE:
// -------------------------------
// Arrow functions do NOT have their own 'this'.
// They inherit 'this' from their enclosing scope (lexical 'this').
// This is why they're useful for callbacks!
//
// ============================================================================

console.log("📖 'this' BINDING RULES DEMO:");

// Create a demo object to show binding rules
const bindingDemo = {
  name: "DemoObject",
  
  // Regular method - uses implicit binding
  regularMethod: function() {
    console.log("   Regular method - this.name:", this.name);
  },
  
  // Arrow method - inherits 'this' from where it's defined (the object literal's scope = global)
  arrowMethod: () => {
    console.log("   Arrow method - this.name:", this?.name, "(arrow inherits global 'this')");
  },
  
  // Method that demonstrates the problem
  delayedMethod: function() {
    console.log("   delayedMethod called, this.name:", this.name);
    
    // PROBLEM: Regular function callback loses 'this'
    setTimeout(function() {
      console.log("   Regular callback - this.name:", this?.name, "(lost 'this'!)");
    }, 10);
    
    // SOLUTION 1: Arrow function preserves 'this'
    setTimeout(() => {
      console.log("   Arrow callback - this.name:", this.name, "(kept 'this'!)");
    }, 20);
    
    // SOLUTION 2: .bind() explicitly sets 'this'
    setTimeout(function() {
      console.log("   Bound callback - this.name:", this.name, "(bound 'this'!)");
    }.bind(this), 30);
  }
};

// Implicit binding - method called on object
console.log("   IMPLICIT BINDING (method called on object):");
bindingDemo.regularMethod();

// Arrow function inherits from definition scope
console.log("   ARROW FUNCTION (inherits from lexical scope):");
bindingDemo.arrowMethod();

// LOSING 'this' - common mistake!
console.log("   LOSING 'this' (passing method as callback):");
const extractedMethod = bindingDemo.regularMethod;
// extractedMethod();  // Would log 'undefined' - 'this' is lost!
console.log("   (extractedMethod would lose 'this' - that's why we use .bind()!)");

// Demonstrating callbacks
console.log("   CALLBACKS (will log after small delays):");
bindingDemo.delayedMethod();

// new Binding
console.log("   NEW BINDING (constructor):");
function PersonDemo(name) {
  this.name = name;  // 'this' refers to the new object being created
  console.log("   Inside constructor, this.name:", this.name);
}
const person = new PersonDemo("Alice");

// Explicit binding with call/apply
console.log("   EXPLICIT BINDING (.call/.apply):");
const anotherObject = { name: "AnotherObject" };
bindingDemo.regularMethod.call(anotherObject);  // Explicitly set this = anotherObject

console.log("");
console.log("   (Check console for delayed callback results...)");
console.log("");

// ============================================================================
// 5. HOW THESE CONCEPTS APPEAR IN THE TASK TRACKER
// ============================================================================
//
// Now let's see how these concepts are used in the actual application:
//
// CLOSURES in this app:
//   - Arrow functions in .forEach(), .map(), .filter() are closures
//   - They "close over" 'this' from the class methods
//   - Example: this.filterButtons.forEach(btn => ...)
//     The arrow function closes over 'this' (the TaskTracker instance)
//
// 'this' BINDING in this app:
//   - We use .bind(this) on event handlers to preserve 'this'
//   - Without binding, 'this' in handleSubmit would be the <form> element
//   - With binding, 'this' stays as the TaskTracker instance
//
// SCOPE CHAIN in this app:
//   - Methods can access class properties via 'this'
//   - Arrow functions in callbacks can access their outer function's 'this'
//
// CALL STACK in this app:
//   - User clicks button → handleListClick → toggleTask → saveTasks → render
//   - Each function call pushes a new context onto the stack
//
// ============================================================================

// ============================================================================
// INTERACTIVE LEARNING EXAMPLES
// ============================================================================
// Copy and paste these into the browser console to experiment!
// Or call them directly: learningExamples.closureDemo()
// ============================================================================

console.log("=".repeat(60));
console.log("📚 INTERACTIVE LEARNING - Try these in the console:");
console.log("=".repeat(60));

// Store examples on window so they're accessible from console
window.learningExamples = {
  
  // -------------------------------------------------------------------------
  // CLOSURE EXAMPLES
  // -------------------------------------------------------------------------
  
  /**
   * Run this to see closure in action:
   * learningExamples.closureDemo()
   */
  closureDemo: function() {
    console.log("\n🔒 CLOSURE DEMO:\n");
    
    function createGreeter(greeting) {
      // 'greeting' is trapped in a closure!
      return function(name) {
        console.log(`${greeting}, ${name}!`);
      };
    }
    
    const sayHello = createGreeter("Hello");
    const sayHowdy = createGreeter("Howdy");
    
    console.log("sayHello('World'):");
    sayHello("World");  // "Hello, World!"
    
    console.log("sayHowdy('Partner'):");
    sayHowdy("Partner"); // "Howdy, Partner!"
    
    console.log("\nNotice: Each function remembers its own 'greeting' value!");
    console.log("That's closure - the inner function 'closes over' outer variables.\n");
  },
  
  /**
   * Run this to see private variables via closure:
   * learningExamples.privateVariableDemo()
   */
  privateVariableDemo: function() {
    console.log("\n🔐 PRIVATE VARIABLE DEMO:\n");
    
    function createBankAccount(initialBalance) {
      // This variable is PRIVATE - no direct access!
      let balance = initialBalance;
      
      return {
        deposit: function(amount) {
          balance += amount;
          console.log(`Deposited $${amount}. Balance: $${balance}`);
        },
        withdraw: function(amount) {
          if (amount > balance) {
            console.log("Insufficient funds!");
            return;
          }
          balance -= amount;
          console.log(`Withdrew $${amount}. Balance: $${balance}`);
        },
        getBalance: function() {
          console.log(`Current balance: $${balance}`);
          return balance;
        }
      };
    }
    
    console.log("Creating account with $100:");
    const account = createBankAccount(100);
    
    account.deposit(50);
    account.withdraw(30);
    account.getBalance();
    
    console.log("\nTrying to access 'balance' directly:");
    console.log("account.balance =", account.balance); // undefined!
    console.log("The balance variable is private - only accessible through methods!\n");
  },
  
  // -------------------------------------------------------------------------
  // 'THIS' BINDING EXAMPLES
  // -------------------------------------------------------------------------
  
  /**
   * Run this to see how 'this' gets lost:
   * learningExamples.thisLossDemo()
   */
  thisLossDemo: function() {
    console.log("\n⚠️ 'THIS' LOSS DEMO:\n");
    
    const user = {
      name: "Alice",
      greet: function() {
        console.log(`Hello, I'm ${this.name}`);
      }
    };
    
    console.log("user.greet() - calling method ON the object:");
    user.greet();  // Works! "Hello, I'm Alice"
    
    console.log("\nExtracting method and calling it:");
    const extractedGreet = user.greet;
    console.log("extractedGreet() - calling extracted method:");
    extractedGreet();  // Broken! 'this' is undefined or window
    
    console.log("\nUsing .bind() to fix it:");
    const boundGreet = user.greet.bind(user);
    console.log("boundGreet() - calling bound method:");
    boundGreet();  // Works! "Hello, I'm Alice"
    
    console.log("\n💡 This is why we use .bind(this) in our TaskTracker!\n");
  },
  
  /**
   * Run this to see all binding rules:
   * learningExamples.bindingRulesDemo()
   */
  bindingRulesDemo: function() {
    console.log("\n📋 ALL BINDING RULES DEMO:\n");
    
    function showThis(label) {
      console.log(`${label}: this =`, this);
    }
    
    const obj1 = { name: "obj1", showThis };
    const obj2 = { name: "obj2" };
    
    console.log("RULE 4 - Default Binding (strict mode = undefined):");
    showThis("Direct call");
    
    console.log("\nRULE 3 - Implicit Binding (called on object):");
    obj1.showThis("obj1.showThis()");
    
    console.log("\nRULE 2 - Explicit Binding (.call/.apply/.bind):");
    showThis.call(obj2, ".call(obj2)");
    showThis.apply(obj2, [".apply(obj2)"]);
    const boundShow = showThis.bind(obj2);
    boundShow(".bind(obj2)");
    
    console.log("\nRULE 1 - 'new' Binding (constructor):");
    function Person(name) {
      this.name = name;
      console.log("new Person(): this =", this);
    }
    const p = new Person("Bob");
    
    console.log("\n⬆️ Higher rules override lower rules (new > explicit > implicit > default)\n");
  },
  
  /**
   * Run this to see arrow function 'this':
   * learningExamples.arrowThisDemo()
   */
  arrowThisDemo: function() {
    console.log("\n➡️ ARROW FUNCTION 'THIS' DEMO:\n");
    
    const obj = {
      name: "MyObject",
      
      regularMethod: function() {
        console.log("Regular method, this.name:", this.name);
        
        // Regular function inside - loses 'this'!
        const regularInner = function() {
          console.log("Regular inner, this.name:", this?.name || "undefined (lost!)");
        };
        regularInner();
        
        // Arrow function inside - inherits 'this'!
        const arrowInner = () => {
          console.log("Arrow inner, this.name:", this.name, "(inherited!)");
        };
        arrowInner();
      },
      
      // Arrow method - inherits 'this' from definition scope (global)
      arrowMethod: () => {
        console.log("Arrow method, this:", "window/global (not obj!)");
      }
    };
    
    obj.regularMethod();
    obj.arrowMethod();
    
    console.log("\n💡 Arrow functions: Great for callbacks, bad for methods!\n");
  },
  
  // -------------------------------------------------------------------------
  // SCOPE CHAIN EXAMPLE
  // -------------------------------------------------------------------------
  
  /**
   * Run this to visualize scope chain:
   * learningExamples.scopeChainDemo()
   */
  scopeChainDemo: function() {
    console.log("\n🔗 SCOPE CHAIN DEMO:\n");
    
    const global = "GLOBAL";
    
    function level1() {
      const level1Var = "LEVEL 1";
      
      function level2() {
        const level2Var = "LEVEL 2";
        
        function level3() {
          const level3Var = "LEVEL 3";
          
          console.log("Inside level3, looking for variables...");
          console.log("  level3Var:", level3Var, "← Found in current scope");
          console.log("  level2Var:", level2Var, "← Found 1 level up");
          console.log("  level1Var:", level1Var, "← Found 2 levels up");
          console.log("  global:", global, "← Found 3 levels up (global)");
        }
        
        level3();
      }
      
      level2();
    }
    
    level1();
    console.log("\nJavaScript searches up the chain until it finds the variable!\n");
  },
  
  // -------------------------------------------------------------------------
  // CALL STACK EXAMPLE
  // -------------------------------------------------------------------------
  
  /**
   * Run this to see call stack in action:
   * learningExamples.callStackDemo()
   */
  callStackDemo: function() {
    console.log("\n📚 CALL STACK DEMO:\n");
    console.log("Watch the call stack in DevTools (add a breakpoint or use debugger)");
    console.log("");
    
    function first() {
      console.log("1. first() called - pushed to stack");
      console.log("   Stack: [first]");
      second();
      console.log("5. first() finishing - about to pop");
    }
    
    function second() {
      console.log("2. second() called - pushed to stack");
      console.log("   Stack: [first, second]");
      third();
      console.log("4. second() finishing - about to pop");
    }
    
    function third() {
      console.log("3. third() called - pushed to stack");
      console.log("   Stack: [first, second, third]");
      // debugger;  // Uncomment to pause and see call stack in DevTools!
      console.log("   third() finishing - about to pop");
    }
    
    first();
    console.log("6. All done - stack is empty\n");
  }
};

console.log("");
console.log("Available interactive examples:");
console.log("  • learningExamples.closureDemo()");
console.log("  • learningExamples.privateVariableDemo()");
console.log("  • learningExamples.thisLossDemo()");
console.log("  • learningExamples.bindingRulesDemo()");
console.log("  • learningExamples.arrowThisDemo()");
console.log("  • learningExamples.scopeChainDemo()");
console.log("  • learningExamples.callStackDemo()");
console.log("=".repeat(60));
console.log("");
console.log("Now loading the Task Tracker application...");
console.log("");
