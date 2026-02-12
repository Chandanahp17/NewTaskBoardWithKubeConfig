const API = "http://192.168.49.2:30080/api/tasks";

function loadTasks() {
    fetch(API)
        .then(res => res.json())
        .then(tasks => {
            const list = document.getElementById("taskList");
            list.innerHTML = "";

            tasks.forEach(task => {
                const li = document.createElement("li");
                li.textContent = `${task.title} - ${task.status} `;

                if (task.status === "PENDING") {
                    const btn = document.createElement("button");
                    btn.textContent = "Mark Done";
                    btn.addEventListener("click", () => markDone(task.id));
                    li.appendChild(btn);
                }

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
