// Initialize tasks
function initTasks() {
  if (!localStorage.getItem("emsTasks")) {
    localStorage.setItem("emsTasks", JSON.stringify([]));
  }
}

// Task management
const tasks = {
  getAll: () => JSON.parse(localStorage.getItem("emsTasks")) || [],
  getById: (id) => tasks.getAll().find((task) => task.id === id),
  getByUser: (userId) =>
    tasks.getAll().filter((task) => task.assignedTo === userId),
  add: (taskData) => {
    const tasksList = tasks.getAll();
    const newTask = {
      id: tasksList.length ? Math.max(...tasksList.map((t) => t.id)) + 1 : 1,
      ...taskData,
      created: new Date().toISOString(),
      status: "pending",
      completed: null,
    };
    tasksList.push(newTask);
    localStorage.setItem("emsTasks", JSON.stringify(tasksList));
    return newTask;
  },
  update: (id, updates) => {
    const tasksList = tasks.getAll();
    const index = tasksList.findIndex((t) => t.id === id);
    if (index !== -1) {
      if (updates.status === "completed") {
        updates.completed = new Date().toISOString();
      }
      tasksList[index] = { ...tasksList[index], ...updates };
      localStorage.setItem("emsTasks", JSON.stringify(tasksList));
      return tasksList[index];
    }
    return null;
  },
  delete: (id) => {
    const tasksList = tasks.getAll().filter((task) => task.id !== id);
    localStorage.setItem("emsTasks", JSON.stringify(tasksList));
  },
};

// Initialize
initTasks();

function renderAssignedTasksForEmployee() {
  const user = session.get();
  if (!user || user.role !== "employee") return;

  const allTasks = tasks.getAll(); // Get all tasks from LocalStorage
  const employeeTasks = allTasks.filter(
    (task) => task.assignedTo === user.empID
  );

  const container = document.getElementById("employeeTaskList"); // You must have this div in your HTML
  if (!container) return;

  container.innerHTML = "";

  if (employeeTasks.length === 0) {
    container.innerHTML = "<p>No tasks assigned to you yet.</p>";
    return;
  }

  employeeTasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card"); 

    taskCard.innerHTML = `
      <h3>${task.title}</h3>
      <p><strong>Description:</strong> ${task.description}</p>
      <p><strong>Deadline:</strong> ${task.deadline}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      ${
        task.status === "pending" || task.status === "active"
          ? `
        <button onclick="updateTaskStatus(${task.id}, 'completed')">Mark as Completed</button>
        <button onclick="updateTaskStatus(${task.id}, 'failed')">Mark as Failed</button>
      `
          : `<p><strong>Final Status:</strong> ${task.status}</p>`
      }
    `;

    container.appendChild(taskCard);
  });
}

function updateTaskStatus(taskId, newStatus) {
  tasks.update(taskId, { status: newStatus });
  renderAssignedTasksForEmployee(); // Refresh the list after update
}

window.addEventListener("DOMContentLoaded", () => {
  renderAssignedTasksForEmployee();
});
