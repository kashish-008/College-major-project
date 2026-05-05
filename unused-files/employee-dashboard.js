/* ===== Employee Dashboard Page Logic ===== */

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "employee") {
    // Allow dashboard to load for now
  }

  /* Task rendering */
  window.renderMyTasks = function () {
    const tasks = getTasks().filter(
      (t) => t.employee.toLowerCase() === currentUser.name.toLowerCase(),
    );
    document.getElementById("employeeStats").innerHTML = `
      <div class="stat-card"><h3>${tasks.length}</h3><p>Total Tasks</p></div>
      <div class="stat-card"><h3>${tasks.filter((t) => t.status === "active").length}</h3><p>Active</p></div>
      <div class="stat-card"><h3>${tasks.filter((t) => t.status === "completed").length}</h3><p>Completed</p></div>
      <div class="stat-card"><h3>${tasks.filter((t) => t.status === "failed").length}</h3><p>Failed</p></div>
    `;
    const container = document.getElementById("myTasksContainer");
    container.innerHTML = tasks.length
      ? tasks
          .map(
            (t) => `
      <div class="task-card" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:8px;">
        <strong>${escapeHtml(t.name)}</strong> (<span class="badge ${t.status}">${t.status}</span>)
        <p>${escapeHtml(t.description)}</p>
        ${
          t.status === "active"
            ? `
          <button class="btn btn-sm btn-primary" onclick="updateTaskStatus(${t.id},'completed')">Mark Completed</button>
          <button class="btn btn-sm btn-danger" onclick="updateTaskStatus(${t.id},'failed')">Mark Failed</button>
        `
            : ""
        }
      </div>
    `,
          )
          .join("")
      : "<p>No tasks assigned yet.</p>";
  };

  /* Load sent messages */
  window.loadMyMessages = function () {
    const msgs = getMessages().filter((m) => m.from.includes(currentUser.name));
    const container = document.getElementById("myMessagesContainer");
    if (container) {
      container.innerHTML = msgs.length
        ? msgs
            .map(
              (m) => `
        <div class="message-item">
          <div class="msg-header"><strong>${escapeHtml(m.from)}</strong> <span>${new Date(m.date).toLocaleString()}</span></div>
          <div><strong>Subject:</strong> ${escapeHtml(m.subject)}</div>
          <p>${escapeHtml(m.text)}</p>
        </div>
      `,
            )
            .join("")
        : "<p>No messages sent yet.</p>";
    }
  };

  /* Load received messages */
  window.loadReceivedMessages = function () {
    const allMsgs = getMessages().filter(
      (m) => m.to === "all_employees" || m.to === currentUser.name,
    );
    const hiddenIds = getHiddenMessages(currentUser.name);
    const readIds = getReadMessages(currentUser.name);
    const visibleMsgs = allMsgs.filter(
      (m) => !hiddenIds.includes(m.id || m.date),
    );

    const container = document.getElementById("receivedMessagesContainer");
    container.innerHTML = visibleMsgs.length
      ? visibleMsgs
          .map((m) => {
            const msgId = m.id || m.date;
            const isRead = readIds.includes(msgId);
            return `
        <div class="message-item ${isRead ? "read" : "unread"}" id="msg-${msgId}">
          <div class="msg-header">
            <strong>${escapeHtml(m.from)}</strong>
            <span>${new Date(m.date).toLocaleString()}</span>
          </div>
          <div><strong>Subject:</strong> ${escapeHtml(m.subject)}</div>
          <p>${escapeHtml(m.text)}</p>
          <div class="msg-actions">
            <button class="btn btn-sm btn-outline" onclick="toggleRead('${msgId}')">
              ${isRead ? "Mark Unread" : "Mark Read"}
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteReceivedMessage('${msgId}')">Delete</button>
          </div>
        </div>
      `;
          })
          .join("")
      : "<p>No messages from Admin yet.</p>";
  };

  /* Toggle read status */
  window.toggleRead = function (msgId) {
    let readIds = getReadMessages(currentUser.name);
    if (readIds.includes(msgId)) {
      readIds = readIds.filter((id) => id !== msgId);
    } else {
      readIds.push(msgId);
    }
    saveReadMessages(currentUser.name, readIds);
    loadReceivedMessages();
  };

  /* Delete received message */
  window.deleteReceivedMessage = function (msgId) {
    let hiddenIds = getHiddenMessages(currentUser.name);
    if (!hiddenIds.includes(msgId)) {
      hiddenIds.push(msgId);
    }
    saveHiddenMessages(currentUser.name, hiddenIds);
    loadReceivedMessages();
  };

  /* Theme toggle */
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      this.querySelector("i").classList.toggle("fa-moon");
      this.querySelector("i").classList.toggle("fa-sun");
    });
  }

  /* Logout */
  window.logout = function () {
    sessionStorage.removeItem("currentUser");
    window.location.href = "index.html";
  };

  /* Send message to admin */
  const messageForm = document.getElementById("messageForm");
  if (messageForm) {
    messageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const msg = {
        id: Date.now(),
        from: currentUser.name + " (Employee)",
        subject: document.getElementById("msgSubject").value.trim(),
        text: document.getElementById("msgText").value.trim(),
        date: new Date().toISOString(),
      };
      const msgs = getMessages();
      msgs.push(msg);
      localStorage.setItem("emsMessages", JSON.stringify(msgs));
      this.reset();
      alert("Message sent to Admin!");
      loadMyMessages();
    });
  }

  /* Sidebar navigation */
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelectorAll(".sidebar-nav a")
        .forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      const page = this.dataset.page;
      document
        .querySelectorAll(".page")
        .forEach((p) => (p.style.display = "none"));
      document.getElementById(`page-${page}`).style.display = "block";
      if (page === "dashboard") renderMyTasks();
      if (page === "messages") {
        loadMyMessages();
        loadReceivedMessages();
      }
    });
  });

  /* Initialize dashboard on load */
  initSidebarNavigation();
  renderMyTasks();
  document.getElementById("greetingText").textContent =
    `Welcome, ${currentUser.name}`;
  document.getElementById("userDetails").textContent = "Role: Employee";
});
