const API = "http://localhost:8080/api/tasks";

function loadTasks() {
    fetch(API)
        .then(res => res.json())
        .then(tasks => {
            const list = document.getElementById("taskList");
            list.innerHTML = "";

            tasks.forEach(task => {
                const li = document.createElement("li");

                li.innerHTML = `
                    ${task.title} - ${task.status}
                    ${task.status === "PENDING" 
                        ? `<button onclick="markDone(${task.id})">Mark Done</button>`
                        : ""}
                `;

                list.appendChild(li);
            });
        })
        .catch(err => console.error("Error loading tasks:", err));
}

function addTask() {
    const title = document.getElementById("taskTitle").value;

    fetch(API + "?title=" + encodeURIComponent(title), {
        method: "POST"
    }).then(() => {
        document.getElementById("taskTitle").value = "";
        loadTasks();
    });
}

function markDone(id) {
    fetch(API + "/" + id + "/done", {
        method: "PUT"
    }).then(() => {
        loadTasks();
    });
}

window.onload = loadTasks;
