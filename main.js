document.addEventListener("DOMContentLoaded", () => {
    //Tasks
    const taskInput = document.querySelector("#task-input");
    const taskForm = document.querySelector("#task-form");
    const taskList = document.querySelector("#task-list");

    // Notes
    const noteForm = document.querySelector("#note-form");
    const noteTitle = document.querySelector("#note-title");
    const noteContent = document.querySelector("#note-content");
    const notesList = document.querySelector("#notes-list");

    // Weather
    const apiKey = "83e5f2cd75dcb38947827c1db7b06f54"; 
    const weatherInfo = document.querySelector("#weather-info");
    const weatherForm = document.querySelector("#weather-search-form");
    const cityInput = document.querySelector("#city-input");

    // Initialize the app
    loadTasks();
    loadNotes();
    fetchWeather();

    // ---- Task Manager ----
    // Add task
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText === "") return;

        const task = {
            id: Date.now(),
            text: taskText
        };

        addTaskToDOM(task);
        saveTaskToLocalStorage(task);
        taskInput.value = ""; // Clear input
    });

    // Delete task
    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-task")) {
            const taskId = e.target.parentElement.dataset.id;
            deleteTask(taskId);
        }
    });

    function addTaskToDOM(task) {
        const li = document.createElement("li");
        li.dataset.id = task.id;
        li.innerHTML = `
            ${task.text}
            <button class="delete-task">Delete</button>
        `;
        taskList.appendChild(li);
    }

    function saveTaskToLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(addTaskToDOM);
    }

    function deleteTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.filter((task) => task.id !== parseInt(taskId));
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        document.querySelector(`[data-id='${taskId}']`).remove();
    }

    // ---- Notes Manager ----
    // Add note
    noteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();

        if (title === "" || content === "") return;

        const note = {
            id: Date.now(),
            title,
            content
        };

        addNoteToDOM(note);
        saveNoteToLocalStorage(note);
        noteTitle.value = ""; // Clear input
        noteContent.value = ""; // Clear textarea
    });

    function addNoteToDOM(note) {
        const div = document.createElement("div");
        div.classList.add("note-item");
        div.dataset.id = note.id;
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button class="delete-note">Delete</button>
        `;
        notesList.appendChild(div);

        div.querySelector(".delete-note").addEventListener("click", () => {
            deleteNote(note.id);
        });
    }

    function saveNoteToLocalStorage(note) {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.forEach(addNoteToDOM);
    }

    function deleteNote(noteId) {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const updatedNotes = notes.filter((note) => note.id !== parseInt(noteId));
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        document.querySelector(`[data-id='${noteId}']`).remove();
    }

    // ---- Weather Section ----
    function fetchWeather() {
        const apiKey = "83e5f2cd75dcb38947827c1db7b06f54"; // Your API key
        const city = "Los Angeles"; // Desired city
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
        // Reference the weather display section
        const weatherInfo = document.querySelector("#weather-info");
    
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const temp = data.main.temp;
                const weather = data.weather[0].description;
                weatherInfo.innerHTML = `
                    <p><strong>City:</strong> ${city}</p>
                    <p><strong>Temperature:</strong> ${temp}°C</p>
                    <p><strong>Condition:</strong> ${weather}</p>
                `;
            })
            .catch((err) => {
                console.error("Failed to fetch weather data:", err);
                weatherInfo.innerHTML = `<p>Unable to load weather data. Please try again later.</p>`;
            });
    }
    
    // Call the function to fetch weather data
    fetchWeather();
});