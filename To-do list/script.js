const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const quoteText = document.getElementById("quote-text");
const body = document.body;

// Array of theme classes corresponding to the CSS variables
const themes = ['theme-default', 'theme-green', 'theme-purple'];
let currentThemeIndex = 0;

// --- Extensive Motivational Quotes Data ---
const quotes = [
    "The secret of getting ahead is getting started.",
    "Well begun is half done. Now finish it!",
    "Action is the foundational key to all success.",
    "Don't wait. The time will never be just right.",
    "A journey of a thousand miles begins with a single step.",
    "The way to get started is to quit talking and begin doing.",
    "Do the hard jobs first. The easy jobs will take care of themselves.",
    "The best way to predict the future is to create it.",
    "You don't have to be great to start, but you have to start to be great.",
    "Motivation is what gets you started. Habit is what keeps you going.",
    "The only way to do great work is to love what you do.",
    "Perfection is not attainable, but if we chase perfection we can catch excellence.",
    "What you do today can improve all your tomorrows.",
    "Focus on being productive instead of busy.",
    "Discipline is the bridge between goals and accomplishment.",
    "Either you run the day, or the day runs you."
];

// --- Initialization: Load Quote, Theme, and Tasks ---
window.onload = function() {
    loadQuote();
    loadTheme();
    showTask();
};

// Function to load and display a random quote
function loadQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
}

// --- Theme Changer Logic ---
function loadTheme() {
    // Load saved theme or use default
    const savedTheme = localStorage.getItem('theme') || themes[0];
    body.className = savedTheme;
    currentThemeIndex = themes.indexOf(savedTheme);
}

function changeTheme() {
    // Cycle to the next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];
    
    // Update body class and save to local storage
    body.className = nextTheme;
    localStorage.setItem('theme', nextTheme);
}


// --- Task Management Functions (Same as before, but with improved styles) ---

function addTask() {
    if (inputBox.value.trim() === '') {
        alert("Please enter a task!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value.trim();
        
        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; // Unicode 'x'
        li.appendChild(span);
        
        listContainer.appendChild(li);
    }
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
        showFilteredTasks(); // Re-filter to hide/show based on completion
        
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);


// --- Data Persistence (Local Storage) ---

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}


// --- Filtering Functionality ---

let currentFilter = 'all';

function filterTasks(filterType) {
    currentFilter = filterType;
    showFilteredTasks();
    
    // Update active class on buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[onclick="filterTasks('${filterType}')"]`).classList.add('active');
}

function showFilteredTasks() {
    const allTasks = listContainer.getElementsByTagName("li");
    
    for (let task of allTasks) {
        task.style.display = "flex"; 
        
        const isCompleted = task.classList.contains("checked");
        
        if (currentFilter === 'active' && isCompleted) {
            task.style.display = "none";
        } else if (currentFilter === 'completed' && !isCompleted) {
            task.style.display = "none";
        }
    }
}