/* ===== Admin Dashboard Page Logic ===== */

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "login.html";
    return;
  }

  /* One-time fix: add unique id to old messages */
  (function () {
    const msgs = JSON.parse(localStorage.getItem("emsMessages")) || [];
    let updated = false;
    msgs.forEach((m) => {
      if (typeof m.id === "number") {
        m.id = String(m.id);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem("emsMessages", JSON.stringify(msgs));
    }
  })();

  /* Helper functions */
  function getAllUsers() {
    return JSON.parse(localStorage.getItem("emsUsers")) || [];
  }

  function saveMessages(msgs) {
    localStorage.setItem("emsMessages", JSON.stringify(msgs));
  }

  /* Admin-specific hidden messages storage */
  function getAdminHiddenMessages() {
    return JSON.parse(localStorage.getItem("emsHiddenMessages_admin")) || [];
  }

  function saveAdminHiddenMessages(ids) {
    localStorage.setItem("emsHiddenMessages_admin", JSON.stringify(ids));
  }

  /* Update message badge */
  function updateMessageBadge() {
    const msgs = getMessages();
    const hiddenIds = getAdminHiddenMessages();
    const visibleCount = msgs.filter((m) => !hiddenIds.includes(m.id)).length;
    const badge = document.getElementById("msgBadge");
    if (badge) {
      badge.textContent = visibleCount;
      badge.style.display = visibleCount > 0 ? "inline-block" : "none";
    }
  }

  /* Update dashboard stats */
  window.updateDashboardStats = function () {
    const tasks = getTasks();
    const users = getAllUsers();
    document.getElementById("adminStats").innerHTML = `
      <div class="stat-card"><h3>${users.length}</h3><p>Total Users</p></div>
      <div class="stat-card"><h3>${tasks.length}</h3><p>Total Tasks</p></div>
      <div class="stat-card"><h3>${tasks.filter((t) => t.status === "active").length}</h3><p>Active Tasks</p></div>
      <div class="stat-card"><h3>${tasks.filter((t) => t.status === "completed").length}</h3><p>Completed</p></div>
    `;

    const recent = tasks.slice(-5).reverse();
    const container = document.getElementById("recentTasks");
    container.innerHTML = recent.length
      ? recent
          .map(
            (t) => `
      <div class="task-card" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:8px;">
        <strong>${escapeHtml(t.name)}</strong> → ${escapeHtml(t.employee)} (<span class="badge ${t.status}">${t.status}</span>)
      </div>
    `,
          )
          .join("")
      : "<p>No tasks yet.</p>";
  };

  /* Load employees list */
  window.loadEmployees = function () {
    const users = getUsers();
    const tbody = document.querySelector("#employeesTable tbody");
    if (tbody) {
      tbody.innerHTML = users
        .map(
          (u) => `
        <tr>
          <td>${escapeHtml(u.name)}</td>
          <td>${escapeHtml(u.email)}</td>
          <td>${escapeHtml(u.role)}</td>
          <td>${escapeHtml(u.email.split("@")[0])}</td>
        </tr>
      `,
        )
        .join("");
    }
  };

  /* Render all tasks */
  window.renderAllTasks = function () {
    const tasks = getTasks();
    const container = document.getElementById("allTasksList");
    container.innerHTML = tasks.length
      ? tasks
          .map(
            (t) => `
      <div class="task-card" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between;">
          <strong>${escapeHtml(t.name)}</strong>
          <span class="badge ${t.status}">${t.status}</span>
        </div>
        <p>Assigned to: ${escapeHtml(t.employee)} | Tech: ${escapeHtml(t.tech)} | Timeline: ${escapeHtml(t.time)}</p>
        <p>${escapeHtml(t.description)}</p>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${t.id})">Delete</button>
      </div>
    `,
          )
          .join("")
      : "<p>No tasks yet.</p>";
  };

  window.deleteTask = function (id) {
    if (!confirm("Delete this task?")) return;
    let tasks = getTasks().filter((t) => t.id !== id);
    localStorage.setItem("emsSharedTasks", JSON.stringify(tasks));
    renderAllTasks();
    updateDashboardStats();
  };

  /* Load and manage contacts */
  window.loadContacts = function () {
    const contacts = JSON.parse(localStorage.getItem("emsContacts")) || [];
    const tbody = document.querySelector("#contactsTable tbody");
    if (tbody) {
      tbody.innerHTML = contacts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(
          (c) => `
        <tr>
          <td>${new Date(c.date).toLocaleDateString()}</td>
          <td>${escapeHtml(c.name)}</td>
          <td>${escapeHtml(c.email)}</td>
          <td>${escapeHtml(c.message)}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteContact(${c.id})">Delete</button></td>
        </tr>
      `,
        )
        .join("");
    }
  };

  window.deleteContact = function (id) {
    let contacts = JSON.parse(localStorage.getItem("emsContacts")) || [];
    contacts = contacts.filter((c) => c.id !== id);
    localStorage.setItem("emsContacts", JSON.stringify(contacts));
    loadContacts();
  };

  /* Load and manage messages */
  window.loadMessages = function () {
    const msgs = getMessages();
    const hiddenIds = getAdminHiddenMessages();
    const visibleMsgs = msgs.filter((m) => !hiddenIds.includes(m.id));

    const container = document.getElementById("messagesContainer");
    container.innerHTML = visibleMsgs.length
      ? visibleMsgs
          .map(
            (m) => `
      <div class="message-item">
        <div class="msg-header">
          <strong>${escapeHtml(m.from)}</strong>
          <span>${new Date(m.date).toLocaleString()}</span>
        </div>
        <div><strong>Subject:</strong> ${escapeHtml(m.subject)}</div>
        <p>${escapeHtml(m.text)}</p>
        <button class="btn btn-sm btn-danger" onclick="deleteMessage('${m.id}')">Delete</button>
      </div>
    `,
          )
          .join("")
      : "<p>No messages.</p>";

    updateMessageBadge();
  };

  window.deleteMessage = function (msgId) {
    let hiddenIds = getAdminHiddenMessages();
    if (!hiddenIds.includes(msgId)) {
      hiddenIds.push(msgId);
    }
    saveAdminHiddenMessages(hiddenIds);
    loadMessages();
    updateMessageBadge();
  };

  /* Theme toggle */
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const icon = this.querySelector("i");
      icon.classList.toggle("fa-moon");
      icon.classList.toggle("fa-sun");
    });
  }

  /* Logout */
  window.logout = function () {
    sessionStorage.removeItem("currentUser");
    window.location.href = "index.html";
  };

  /* Task assignment form */
  const taskForm = document.getElementById("taskForm");
  if (taskForm) {
    taskForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newTask = {
        id: Date.now(),
        name: document.getElementById("taskName").value.trim(),
        employee: document.getElementById("employeeName").value.trim(),
        tech: document.getElementById("technology").value.trim(),
        time: document.getElementById("timeline").value.trim(),
        description: document.getElementById("description").value.trim(),
        status: document.getElementById("status").value,
        assignedBy: "Admin",
        createdAt: new Date().toISOString(),
      };
      const tasks = getTasks();
      tasks.push(newTask);
      localStorage.setItem("emsSharedTasks", JSON.stringify(tasks));
      this.reset();
      renderAllTasks();
      updateDashboardStats();
    });
  }

  /* Export contacts */
  const exportBtn = document.getElementById("exportContactsBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      const contacts = JSON.parse(localStorage.getItem("emsContacts")) || [];
      let csv = "Date,Name,Email,Message\n";
      contacts.forEach(
        (c) => (csv += `"${c.date}","${c.name}","${c.email}","${c.message}"\n`),
      );
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "contacts.csv";
      a.click();
    });
  }

  /* Clear contacts */
  const clearContactsBtn = document.getElementById("clearContactsBtn");
  if (clearContactsBtn) {
    clearContactsBtn.addEventListener("click", function () {
      if (confirm("Delete all contacts?")) {
        localStorage.removeItem("emsContacts");
        loadContacts();
      }
    });
  }

  /* Clear messages */
  const clearMessagesBtn = document.getElementById("clearMessagesBtn");
  if (clearMessagesBtn) {
    clearMessagesBtn.addEventListener("click", function () {
      if (confirm("Clear all messages?")) {
        localStorage.removeItem("emsMessages");
        loadMessages();
        updateMessageBadge();
      }
    });
  }

  /* Admin send message */
  const adminSendForm = document.getElementById("adminSendMessageForm");
  if (adminSendForm) {
    adminSendForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const to = document.getElementById("adminMessageTo").value;
      const subject = document
        .getElementById("adminMessageSubject")
        .value.trim();
      const text = document.getElementById("adminMessageText").value.trim();

      const msg = {
        id: String(Date.now()),
        from: "Admin",
        to: to,
        subject: subject,
        text: text,
        date: new Date().toISOString(),
      };

      const msgs = getMessages();
      msgs.push(msg);
      localStorage.setItem("emsMessages", JSON.stringify(msgs));
      this.reset();
      loadMessages();
      updateMessageBadge();
    });
  }

  /* Listen for storage changes from other tabs */
  window.addEventListener("storage", function (e) {
    if (e.key === "emsMessages") {
      updateMessageBadge();
    }
  });

  /* Sidebar Navigation */
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelectorAll(".sidebar-nav a")
        .forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      const pageName = this.getAttribute("data-page");
      document
        .querySelectorAll(".page")
        .forEach((p) => (p.style.display = "none"));
      document.getElementById(`page-${pageName}`).style.display = "block";
      if (pageName === "employees") loadEmployees();
      if (pageName === "contacts") loadContacts();
      if (pageName === "messages") loadMessages();
      if (pageName === "dashboard" || pageName === "tasks")
        updateDashboardStats();
      updateMessageBadge();
    });
  });

  /* Initialize dashboard on load */
  initSidebarNavigation();
  updateDashboardStats();
  renderAllTasks();
  loadEmployees();
  loadContacts();
  loadMessages();
  updateMessageBadge();
  document.getElementById("greetingText").textContent =
    `Welcome, ${currentUser.name}`;
  document.getElementById("userDetails").textContent = "Role: Admin";
});
