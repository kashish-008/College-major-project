/* ===== Dashboard Common Functions & Data Getters ===== */

/* Helper function to escape HTML */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* Data Getters */
function getUsers() {
  return JSON.parse(localStorage.getItem("emsUsers")) || [];
}

function getTasks() {
  return JSON.parse(localStorage.getItem("emsSharedTasks")) || [];
}

function getMessages() {
  return JSON.parse(localStorage.getItem("emsMessages")) || [];
}

/* Personal read/hidden storage for messages */
function getReadMessages(userName) {
  return JSON.parse(localStorage.getItem(`emsReadMessages_${userName}`)) || [];
}

function getHiddenMessages(userName) {
  return (
    JSON.parse(localStorage.getItem(`emsHiddenMessages_${userName}`)) || []
  );
}

function saveReadMessages(userName, ids) {
  localStorage.setItem(`emsReadMessages_${userName}`, JSON.stringify(ids));
}

function saveHiddenMessages(userName, ids) {
  localStorage.setItem(`emsHiddenMessages_${userName}`, JSON.stringify(ids));
}

/* Sidebar navigation - defined inline in each dashboard */
function initSidebarNavigation() {
  /* Each dashboard handles its own sidebar navigation */
}

/* Update Task Status */
function updateTaskStatus(taskId, newStatus) {
  let tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx !== -1) {
    tasks[idx].status = newStatus;
    localStorage.setItem("emsSharedTasks", JSON.stringify(tasks));

    // Refresh current view if renderMyTasks exists
    if (typeof renderMyTasks === "function") {
      renderMyTasks();
    }
  }
}
