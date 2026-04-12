export const getFallbackQuestions = (topicId: string, count: number = 10) => {
  const allSets: Record<string, any[]> = {
    dsa_arena: [
      {
        id: "FALLBACK_DSA_01",
        prompt: "Which data structure operates on a 'Last In, First Out' (LIFO) principle?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Queue" },
          { id: "OPT_2", text: "Stack" },
          { id: "OPT_3", text: "Linked List" },
          { id: "OPT_4", text: "Hash Map" }
        ],
        explanation: "A Stack follows the LIFO principle, where the last element added is the first one to be removed.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DSA_02",
        prompt: "What is the worst-case time complexity of QuickSort?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "O(n log n)" },
          { id: "OPT_2", text: "O(n)" },
          { id: "OPT_3", text: "O(n^2)" },
          { id: "OPT_4", text: "O(log n)" }
        ],
        explanation: "QuickSort's worst-case occurs when the pivot element is either the greatest or smallest element, leading to O(n^2).",
        maxScore: 10
      },
      {
        id: "FALLBACK_DSA_03",
        prompt: "In a Binary Search Tree (BST), the left child of a node is always:",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Greater than the node" },
          { id: "OPT_2", text: "Less than the node" },
          { id: "OPT_3", text: "Equal to the node" },
          { id: "OPT_4", text: "A leaf node" }
        ],
        explanation: "By definition, the left child of a BST node must be strictly less than its parent.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DSA_04",
        prompt: "Which algorithm is used to find the shortest path in a weighted graph with no negative cycles?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Breadth-First Search" },
          { id: "OPT_2", text: "Kruskal's Algorithm" },
          { id: "OPT_3", text: "Dijkstra's Algorithm" },
          { id: "OPT_4", text: "Floyd-Warshall" }
        ],
        explanation: "Dijkstra's algorithm finds the shortest path tree from a single source node.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DSA_05",
        prompt: "Explain the difference between a Queue and a Stack.",
        type: "logic_explanation",
        correctAnswer: "A stack is LIFO (Last In, First Out) while a queue is FIFO (First In, First Out).",
        explanation: "In a stack, elements are added and removed from the same end. In a queue, they are added at one end and removed at the other.",
        maxScore: 15
      },
      {
        id: "FALLBACK_DSA_06",
        prompt: "Which data structure uses hashing to map keys to values?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Graph" },
          { id: "OPT_2", text: "Heap" },
          { id: "OPT_3", text: "Hash Table" },
          { id: "OPT_4", text: "Trie" }
        ],
        explanation: "A Hash Table uses a hash function to map keys to their corresponding values.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DSA_07",
        prompt: "Fix the logic: This binary search function has an infinite loop.",
        type: "fix_code",
        template: "function search(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    let m = Math.floor((l+r)/2);\n    if (arr[m] === target) return m;\n    if (arr[m] < target) l = m;\n    else r = m;\n  }\n  return -1;\n}",
        correctAnswer: "function search(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    let m = Math.floor((l+r)/2);\n    if (arr[m] === target) return m;\n    if (arr[m] < target) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}",
        explanation: "You must increment or decrement 'm' (mid) to prevent the pointers from getting stuck on the same element.",
        maxScore: 20
      },
      {
        id: "FALLBACK_DSA_08",
        prompt: "What is the time complexity of searching an element in a balanced Binary Search Tree?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "O(1)" },
          { id: "OPT_2", text: "O(log n)" },
          { id: "OPT_3", text: "O(n)" },
          { id: "OPT_4", text: "O(n log n)" }
        ],
        explanation: "In a balanced BST, the height is bounded by O(log n), making search logarithmic.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DSA_09",
        prompt: "A graph representation using an array of linked lists is called:",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Adjacency Matrix" },
          { id: "OPT_2", text: "Adjacency List" },
          { id: "OPT_3", text: "Edge List" },
          { id: "OPT_4", text: "Incidence Matrix" }
        ],
        explanation: "Adjacency lists use an array (or map) where each index corresponds to a vertex and points to a linked list of its neighbors.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DSA_10",
        prompt: "What is a 'Heap' data structure primarily used for?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Implementing Priority Queues" },
          { id: "OPT_2", text: "Storing keys cryptographically" },
          { id: "OPT_3", text: "Managing recursive function calls" },
          { id: "OPT_4", text: "String auto-completion" }
        ],
        explanation: "Heaps maintain a specific order (min or max) efficiently, making them ideal for priority queues.",
        maxScore: 10
      }
    ],
    dbms_arena: [
      {
        id: "FALLBACK_DBMS_01",
        prompt: "In a relational database, what is the primary purpose of a 'Foreign Key'?",
        type: "logic_explanation",
        correctAnswer: "To establish and enforce a link between data in two tables.",
        explanation: "Foreign keys are used to maintain referential integrity between related entities.",
        maxScore: 15
      },
      {
        id: "FALLBACK_DBMS_02",
        prompt: "Which command is used to remove an entire table and its schema from a database?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "DELETE" },
          { id: "OPT_2", text: "TRUNCATE" },
          { id: "OPT_3", text: "DROP" },
          { id: "OPT_4", text: "REMOVE" }
        ],
        explanation: "DROP completely destroys the table and schema. DELETE only removes rows. TRUNCATE empties the table rapidly.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DBMS_03",
        prompt: "What does ACID stand for in database transactions?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Atomicity, Consistency, Isolation, Durability" },
          { id: "OPT_2", text: "Async, Concurrency, Isolation, Durability" },
          { id: "OPT_3", text: "Atomicity, Consistency, Indexing, Deletion" },
          { id: "OPT_4", text: "Authorization, Control, Indexing, Durability" }
        ],
        explanation: "ACID properties ensure reliable processing of database transactions.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DBMS_04",
        prompt: "Which SQL clause is used to filter records AFTER an aggregation?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "WHERE" },
          { id: "OPT_2", text: "ORDER BY" },
          { id: "OPT_3", text: "HAVING" },
          { id: "OPT_4", text: "GROUP BY" }
        ],
        explanation: "HAVING filters groups/aggregations, whereas WHERE filters individual rows before aggregation.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DBMS_05",
        prompt: "Write a SQL query to select all columns from the 'employees' table where the 'salary' is greater than 50000.",
        type: "write_code",
        template: "-- Write SQL query here",
        correctAnswer: "SELECT * FROM employees WHERE salary > 50000;",
        explanation: "Standard SELECT syntax with a WHERE clause for filtering.",
        maxScore: 15
      },
      {
        id: "FALLBACK_DBMS_06",
        prompt: "The process of organizing data to minimize redundancy is called:",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Indexing" },
          { id: "OPT_2", text: "Normalization" },
          { id: "OPT_3", text: "Hashing" },
          { id: "OPT_4", text: "Clustering" }
        ],
        explanation: "Normalization restructures relations to remove duplication and protect data integrity.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DBMS_07",
        prompt: "Which of these is a NoSQL database?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "PostgreSQL" },
          { id: "OPT_2", text: "MySQL" },
          { id: "OPT_3", text: "Oracle" },
          { id: "OPT_4", text: "MongoDB" }
        ],
        explanation: "MongoDB is a document-oriented NoSQL database. The others are relational (SQL).",
        maxScore: 10
      },
      {
        id: "FALLBACK_DBMS_08",
        prompt: "Explain the difference between an INNER JOIN and a LEFT JOIN.",
        type: "logic_explanation",
        correctAnswer: "INNER JOIN returns records with matching values in both tables. LEFT JOIN returns all records from the left table, and matched records from the right.",
        explanation: "LEFT JOIN preserves rows from the primary table even if there's no match in the joining table.",
        maxScore: 15
      },
      {
        id: "FALLBACK_DBMS_09",
        prompt: "What is an index used for in a database?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "To speed up data retrieval operations" },
          { id: "OPT_2", text: "To encrypt passwords" },
          { id: "OPT_3", text: "To enforce referential integrity" },
          { id: "OPT_4", text: "To compress the database size" }
        ],
        explanation: "Indexes are data structures that improve the speed of data retrieval operations on a table.",
        maxScore: 10
      },
      {
        id: "FALLBACK_DBMS_10",
        prompt: "A transaction that has not been completely executed should be undone. This is associated with:",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Durability" },
          { id: "OPT_2", text: "Atomicity" },
          { id: "OPT_3", text: "Consistency" },
          { id: "OPT_4", text: "Isolation" }
        ],
        explanation: "Atomicity guarantees that transactions are 'all or nothing'. If they fail mid-way, they roll back.",
        maxScore: 10
      }
    ],
    os_arena: [
      {
        id: "FALLBACK_OS_01",
        prompt: "A scenario where two or more processes are waiting indefinitely for an event that can be caused by only one of the waiting processes is known as:",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Starvation" },
          { id: "OPT_2", text: "Deadlock" },
          { id: "OPT_3", text: "Thrashing" },
          { id: "OPT_4", text: "Context Switching" }
        ],
        explanation: "Deadlock is a state where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.",
        maxScore: 10
      },
      {
        id: "FALLBACK_OS_02",
        prompt: "What is virtual memory?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Memory located in the CPU cache" },
          { id: "OPT_2", text: "A technique that illusions the user into thinking main memory is larger than it is" },
          { id: "OPT_3", text: "Memory used solely by the OS kernel" },
          { id: "OPT_4", text: "A physical chip dedicated to swapping" }
        ],
        explanation: "Virtual memory maps logical addresses to physical addresses and uses disk storage to expand apparent memory capacity.",
        maxScore: 10
      },
      {
        id: "FALLBACK_OS_03",
        prompt: "Explain the difference between a process and a thread.",
        type: "logic_explanation",
        correctAnswer: "A process is a program in execution with its own memory space. A thread is a lightweight subunit within a process that shares the memory space.",
        explanation: "Threads are easier to create and context switch, while processes offer rigid isolation.",
        maxScore: 15
      },
      {
        id: "FALLBACK_OS_04",
        prompt: "Which of the following scheduling algorithms can lead to starvation?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Round Robin" },
          { id: "OPT_2", text: "Shortest Job First" },
          { id: "OPT_3", text: "First Come First Serve" },
          { id: "OPT_4", text: "None of the above" }
        ],
        explanation: "SJF can starve long jobs if short jobs continually arrive.",
        maxScore: 10
      },
      {
        id: "FALLBACK_OS_05",
        prompt: "What does an OS 'Scheduler' do?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Writes data to disk" },
          { id: "OPT_2", text: "Manages network packets" },
          { id: "OPT_3", text: "Selects the next process to execute on the CPU" },
          { id: "OPT_4", text: "Compiles source code into execution binaries" }
        ],
        explanation: "The scheduler decides which processes access the CPU and for how long.",
        maxScore: 10
      },
      {
        id: "FALLBACK_OS_06",
        prompt: "Which synchronization primitive uses a counter to manage access to a resource pool?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Mutex" },
          { id: "OPT_2", text: "Semaphore" },
          { id: "OPT_3", text: "Monitor" },
          { id: "OPT_4", text: "Spinlock" }
        ],
        explanation: "A counting semaphore limits concurrent access to a fixed number of resources.",
        maxScore: 10
      },
      {
        id: "FALLBACK_OS_07",
        prompt: "What is 'Thrashing' in the context of an OS?",
        type: "logic_explanation",
        correctAnswer: "When the system spends more time swapping pages in and out of memory than executing code.",
        explanation: "Thrashing severely degrades performance due to excessive page faults.",
        maxScore: 15
      },
      {
        id: "FALLBACK_OS_08",
        prompt: "Which of these is NOT a necessary condition for a deadlock?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Mutual Exclusion" },
          { id: "OPT_2", text: "Hold and Wait" },
          { id: "OPT_3", text: "Circular Wait" },
          { id: "OPT_4", text: "Preemption" }
        ],
        explanation: "NO preemption is a deadlock condition. If resources can be preempted, deadlocks can be broken.",
        maxScore: 10
      },
      {
        id: "FALLBACK_OS_09",
        prompt: "The time spent switching from running one process to another is called:",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Dispatch latency" },
          { id: "OPT_2", text: "Context switch overhead" },
          { id: "OPT_3", text: "Turnaround time" },
          { id: "OPT_4", text: "Wait time" }
        ],
        explanation: "Context switching requires saving and loading PCB registers, which is pure overhead.",
        maxScore: 10
      },
      {
        id: "FALLBACK_OS_10",
        prompt: "What is a major advantage of using a microkernel architecture?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Extremely fast performance" },
          { id: "OPT_2", text: "Security and stability" },
          { id: "OPT_3", text: "No context switching required" },
          { id: "OPT_4", text: "Ability to run without hardware" }
        ],
        explanation: "Microkernels limit kernel operations to the bare minimum, isolating drivers and services in user space to prevent total system crashes.",
        maxScore: 10
      }
    ],
    js_arena: [
      {
        id: "FALLBACK_JS_01",
        prompt: "What will `console.log(typeof NaN)` output in JavaScript?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "'undefined'" },
          { id: "OPT_2", text: "'number'" },
          { id: "OPT_3", text: "'NaN'" },
          { id: "OPT_4", text: "'object'" }
        ],
        explanation: "In JavaScript, NaN (Not a Number) is paradoxically considered a numeric data type.",
        maxScore: 10
      },
      {
        id: "FALLBACK_JS_02",
        prompt: "Which keyword is used to declare a variable that cannot be reassigned?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "let" },
          { id: "OPT_2", text: "var" },
          { id: "OPT_3", text: "const" },
          { id: "OPT_4", text: "static" }
        ],
        explanation: "Variables declared with `const` cannot be reassigned (though objects they reference can be mutated).",
        maxScore: 10
      },
      {
        id: "FALLBACK_JS_03",
        prompt: "Fix the logic: This map function should double the array, but it returns an array of undefined.",
        type: "fix_code",
        template: "const arr = [1, 2, 3];\nconst doubled = arr.map(num => {\n  num * 2;\n});",
        correctAnswer: "const arr = [1, 2, 3];\nconst doubled = arr.map(num => {\n  return num * 2;\n});",
        explanation: "If an arrow function uses block body `{ }`, it must explicitly use the `return` keyword.",
        maxScore: 15
      },
      {
        id: "FALLBACK_JS_04",
        prompt: "Explain the concept of a 'Closure' in JavaScript.",
        type: "logic_explanation",
        correctAnswer: "A closure is a function that remembers the variables in its lexical scope even after the outer function has executed.",
        explanation: "Closures allow inner functions to access outer function variables, establishing state.",
        maxScore: 20
      },
      {
        id: "FALLBACK_JS_05",
        prompt: "What does `Array.prototype.reduce()` do?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Executes a reducer function on each element, resulting in a single output value" },
          { id: "OPT_2", text: "Reduces the size of an array by removing empty elements" },
          { id: "OPT_3", text: "Reverses the order of an array in place" },
          { id: "OPT_4", text: "Filters elements based on a condition" }
        ],
        explanation: "Reduce boils an array down to a single value using an accumulator.",
        maxScore: 10
      },
      {
        id: "FALLBACK_JS_06",
        prompt: "Which of the following is NOT a JavaScript primitive data type?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Symbol" },
          { id: "OPT_2", text: "Boolean" },
          { id: "OPT_3", text: "Array" },
          { id: "OPT_4", text: "String" }
        ],
        explanation: "Arrays are highly specialized Objects in JavaScript, not primitives.",
        maxScore: 10
      },
      {
        id: "FALLBACK_JS_07",
        prompt: "What is Event Bubbling?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "When an event starts on the root element and delegates down" },
          { id: "OPT_2", text: "When an event triggers on an element and then triggers on all its ancestors" },
          { id: "OPT_3", text: "When multiple parallel events fire at once" },
          { id: "OPT_4", text: "When events are batched into a single tick" }
        ],
        explanation: "Event bubbling makes events 'bubble up' through the DOM tree from child to parent.",
        maxScore: 10
      },
      {
        id: "FALLBACK_JS_08",
        prompt: "What will `console.log(0 == '0')` and `console.log(0 === '0')` output?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "true, true" },
          { id: "OPT_2", text: "true, false" },
          { id: "OPT_3", text: "false, true" },
          { id: "OPT_4", text: "false, false" }
        ],
        explanation: "Double equals performs type coercion (0 == '0' is true). Triple equals checks type strictness (number vs string is false).",
        maxScore: 10
      },
      {
        id: "FALLBACK_JS_09",
        prompt: "Write a short arrow function called 'add' that adds two numbers together.",
        type: "write_code",
        template: "// Write arrow function here",
        correctAnswer: "const add = (a, b) => a + b;",
        explanation: "Arrow functions allow implicit returns for single expressions.",
        maxScore: 15
      },
      {
        id: "FALLBACK_JS_10",
        prompt: "What concept in JS ensures asynchronous code executes sequentially (like reading a file before proceeding)?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Generators" },
          { id: "OPT_2", text: "Promises / Async-Await" },
          { id: "OPT_3", text: "Web Workers" },
          { id: "OPT_4", text: "Hoisting" }
        ],
        explanation: "Promises and the async/await syntax allow developers to manage the execution order of asynchronous tasks.",
        maxScore: 10
      }
    ],
    aptitude_arena: [
      {
        id: "FALLBACK_APT_01",
        prompt: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "True" },
          { id: "OPT_2", text: "False" }
        ],
        explanation: "This is a classic syllogism. If A forms a subset of B, and B forms a subset of C, A is a subset of C.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_02",
        prompt: "A train running at 36 km/hr crosses a pole in 10 seconds. What is the length of the train?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "100 meters" },
          { id: "OPT_2", text: "120 meters" },
          { id: "OPT_3", text: "80 meters" },
          { id: "OPT_4", text: "360 meters" }
        ],
        explanation: "Convert 36 km/hr to m/s: 36 * (5/18) = 10 m/s. Length = Speed x Time = 10 m/s * 10 sec = 100 meters.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_03",
        prompt: "In a family, A is the father of B. C is the brother of A. D is the wife of C. How is D related to B?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "Mother" },
          { id: "OPT_2", text: "Aunt" },
          { id: "OPT_3", text: "Sister" },
          { id: "OPT_4", text: "Cousin" }
        ],
        explanation: "C is B's uncle (father's brother). D is C's wife, making her B's aunt.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_04",
        prompt: "Find the odd one out: 3, 5, 11, 14, 17, 21",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "21" },
          { id: "OPT_2", text: "17" },
          { id: "OPT_3", text: "14" },
          { id: "OPT_4", text: "3" }
        ],
        explanation: "14 is the only even number, and the others are prime except 21. Look closer: 14 is the only even number.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_05",
        prompt: "If 10 machines take 10 minutes to make 10 widgets, how long does it take 100 machines to make 100 widgets?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "100 minutes" },
          { id: "OPT_2", text: "10 minutes" },
          { id: "OPT_3", text: "1 minute" },
          { id: "OPT_4", text: "1000 minutes" }
        ],
        explanation: "It takes 1 machine 10 minutes to make 1 widget. Thus, 100 machines concurrently building 100 widgets still only takes 10 minutes.",
        maxScore: 15
      },
      {
        id: "FALLBACK_APT_06",
        prompt: "Rearrange the letters 'CIFAIPC' to form an ocean.",
        type: "logic_explanation",
        correctAnswer: "PACIFIC",
        explanation: "The letters rearrange to form the word PACIFIC.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_07",
        prompt: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "$0.10" },
          { id: "OPT_2", text: "$0.05" },
          { id: "OPT_3", text: "$1.00" },
          { id: "OPT_4", text: "$1.10" }
        ],
        explanation: "If the ball is $0.05, the bat is $1.05. Their sum is $1.10.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_08",
        prompt: "Which number should come next in the pattern? 1, 1, 2, 3, 5, 8, __",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "11" },
          { id: "OPT_2", text: "13" },
          { id: "OPT_3", text: "14" },
          { id: "OPT_4", text: "15" }
        ],
        explanation: "Fibonacci sequence: each number is the sum of the two preceding ones. 5 + 8 = 13.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_09",
        prompt: "Some months have 31 days. How many have 28?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "1" },
          { id: "OPT_2", text: "12" },
          { id: "OPT_3", text: "6" },
          { id: "OPT_4", text: "0" }
        ],
        explanation: "ALL 12 months have at least 28 days.",
        maxScore: 10
      },
      {
        id: "FALLBACK_APT_10",
        prompt: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
        type: "mcq",
        options: [
          { id: "OPT_1", text: "7" },
          { id: "OPT_2", text: "10" },
          { id: "OPT_3", text: "12" },
          { id: "OPT_4", text: "13" }
        ],
        explanation: "Alternating sequence: add 3, subtract 2. The sequence is +3, -2, +3, -2, +3, -2. 12 - 2 = 10.",
        maxScore: 10
      }
    ]
  };

  // If the provided topic ID doesn't explicitly match, provide the generic DSA fallback
  const dataset = allSets[topicId.toLowerCase()] || allSets["dsa_arena"];
  return dataset.slice(0, count);
}
