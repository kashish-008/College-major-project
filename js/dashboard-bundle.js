// This module handles user authentication, session management, and user operations
// ===== AUTHENTICATION SYSTEM FOR EMPLOYEE MANAGEMENT =====

// Authorization codes for role-based access control
const AUTH_CODES = {
  admin: "ADMIN123",
  manager: "MANAGER456",
};

// Initialize default users if none exist in localStorage
function initUsers() {
  if (!localStorage.getItem("emsUsers")) {
    const defaultUsers = [
      {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "admin",
        name: "System Admin",
        email: "admin@emspro.com",
        empID: "ADM1001",
        joinDate: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 2,
        username: "manager",
        password: "manager123",
        role: "manager",
        name: "Team Manager",
        email: "manager@emspro.com",
        empID: "MGR2001",
        joinDate: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 3,
        username: "employee",
        password: "employee123",
        role: "employee",
        name: "John Employee",
        email: "employee@emspro.com",
        empID: "EMP3001",
        joinDate: new Date().toISOString(),
        isActive: true,
      },
    ];
    localStorage.setItem("emsUsers", JSON.stringify(defaultUsers));
  }
}

// Authenticate user with username/email and password
function authenticate(username, password, role = null) {
  const users = JSON.parse(localStorage.getItem("emsUsers")) || [];
  return users.find(
    (user) =>
      (user.username === username || user.email === username) &&
      user.password === password &&
      (!role || user.role === role) &&
      user.isActive,
  );
}

// Session management utilities
const session = {
  // Store user data in local storage
  set: (user) => localStorage.setItem("currentUser", JSON.stringify(user)),

  // Retrieve current user from local storage
  get: () => JSON.parse(localStorage.getItem("currentUser")),

  // Clear current session
  clear: () => localStorage.removeItem("currentUser"),

  // Check if session is valid and user has required role
  isValid: (requiredRole) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user && (!requiredRole || user.role === requiredRole);
  },
};

// User management operations
const users = {
  // Get all users from localStorage
  getAll: () => JSON.parse(localStorage.getItem("emsUsers")) || [],

  // Find user by ID
  getById: (id) => users.getAll().find((user) => user.id === id),

  // Add new user with auto-generated ID and employee ID
  add: (userData) => {
    const usersList = users.getAll();
    const newUser = {
      id: usersList.length ? Math.max(...usersList.map((u) => u.id)) + 1 : 1,
      ...userData,
      empID: generateEmployeeID(userData.role),
      joinDate: new Date().toISOString(),
      isActive: true,
    };
    usersList.push(newUser);
    localStorage.setItem("emsUsers", JSON.stringify(usersList));
    return newUser;
  },

  // Update existing user information
  update: (id, updates) => {
    const usersList = users.getAll();
    const index = usersList.findIndex((u) => u.id === id);
    if (index !== -1) {
      usersList[index] = { ...usersList[index], ...updates };
      localStorage.setItem("emsUsers", JSON.stringify(usersList));
      return usersList[index];
    }
    return null;
  },
};

// Generate employee ID based on role with random number
function generateEmployeeID(role) {
  const prefix =
    {
      admin: "ADM",
      manager: "MGR",
      employee: "EMP",
    }[role] || "USR";

  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

// Initialize default users on first load
initUsers();

// Dashboard common functions
function protectDashboard(requiredRole) {
  if (!session.isValid(requiredRole)) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}



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
/* ===== Admin Dashboard Page Logic ===== */

document.addEventListener("DOMContentLoaded", function () {
  // Session check - allow access if user is logged in as admin
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    // For now, continue instead of redirecting to allow dashboard to load
    // Redirect will happen after loadUserProfile if needed
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
    const users = getUsers();
    const adminStatsEl = document.getElementById("adminStats");
    if (adminStatsEl) {
      adminStatsEl.innerHTML = `
        <div class="stat-card"><h3>${users.length}</h3><p>Total Users</p></div>
        <div class="stat-card"><h3>${tasks.length}</h3><p>Total Tasks</p></div>
        <div class="stat-card"><h3>${tasks.filter((t) => t.status === "active").length}</h3><p>Active Tasks</p></div>
        <div class="stat-card"><h3>${tasks.filter((t) => t.status === "completed").length}</h3><p>Completed</p></div>
      `;
    }

    const recent = tasks.slice(-5).reverse();
    const container = document.getElementById("recentTasks");
    if (container) {
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
    }
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
    if (!container) return;
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
    if (!container) return;
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
      // Close mobile sidebar after navigation
      if (document.body.classList.contains("sidebar-open")) {
        document.body.classList.remove("sidebar-open");
      }
    });
  });

  /* Initialize dashboard on load */
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

/* ===== Manager Dashboard Page Logic ===== */

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "manager") {
    // For now, continue instead of redirecting to allow dashboard to load
  }

  // One-time fix: add unique id to old messages that don't have one
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

  /* Update stats and tasks display */
  window.updateStatsAndTasks = function () {
    const tasks = getTasks();
    const managerStatsEl = document.getElementById("managerStats");
    if (managerStatsEl) {
      managerStatsEl.innerHTML = `
        <div class="stat-card"><h3>${getUsers().length}</h3><p>Total Users</p></div>
        <div class="stat-card"><h3>${tasks.length}</h3><p>Total Tasks</p></div>
        <div class="stat-card"><h3>${tasks.filter((t) => t.status === "active").length}</h3><p>Active</p></div>
        <div class="stat-card"><h3>${tasks.filter((t) => t.status === "completed").length}</h3><p>Completed</p></div>
      `;
    }

    const recent = tasks.slice(-5).reverse();
    const recentTasksEl = document.getElementById("recentTasks");
    if (recentTasksEl) {
      recentTasksEl.innerHTML =
        recent
          .map(
            (t) => `
      <div class="task-card" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:8px;">
        <strong>${escapeHtml(t.name)}</strong> → ${escapeHtml(t.employee)} (<span class="badge ${t.status}">${t.status}</span>)
      </div>
    `,
          )
          .join("") || "<p>No tasks yet.</p>";
    }

    const allTasksList = document.getElementById("allTasksList");
    if (allTasksList) {
      allTasksList.innerHTML =
        tasks
          .map(
            (t) => `
        <div class="task-card" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:8px;">
          <strong>${escapeHtml(t.name)}</strong> (${escapeHtml(t.employee)}) - ${t.status}
        </div>
      `,
          )
          .join("") || "<p>No tasks.</p>";
    }
  };

  /* Load employees list */
  window.loadEmployees = function () {
    const users = getUsers();
    const tbody = document.querySelector("#employeesTable tbody");
    if (tbody) {
      tbody.innerHTML = users
        .map(
          (u) => `
        <tr><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>${escapeHtml(u.role)}</td></tr>
      `,
        )
        .join("");
    }
  };

  /* Load received messages from Admin */
  window.loadReceivedMessages = function () {
    const allMsgs = getMessages().filter(
      (m) => m.to === "all_managers" || m.to === currentUser.name,
    );
    const hiddenIds = getHiddenMessages(currentUser.name);
    const readIds = getReadMessages(currentUser.name);
    const visibleMsgs = allMsgs.filter(
      (m) => !hiddenIds.includes(m.id || m.date),
    );

    const container = document.getElementById("receivedMessagesContainer");
    if (!container) return;
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


  /* Send message to admin */
  const messageForm = document.getElementById("messageForm");
  if (messageForm) {
    messageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const msg = {
        id: Date.now(),
        from: currentUser.name + " (Manager)",
        subject: document.getElementById("msgSubject").value.trim(),
        text: document.getElementById("msgText").value.trim(),
        date: new Date().toISOString(),
      };
      const msgs = getMessages();
      msgs.push(msg);
      localStorage.setItem("emsMessages", JSON.stringify(msgs));
      this.reset();
      alert("Message sent to Admin!");
      loadReceivedMessages();
    });
  }

  /* Sidebar Navigation */
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
      if (page === "employees") loadEmployees();
      if (page === "dashboard" || page === "tasks") updateStatsAndTasks();
      if (page === "messages") loadReceivedMessages();
      // Close mobile sidebar after navigation
      if (document.body.classList.contains("sidebar-open")) {
        document.body.classList.remove("sidebar-open");
      }
    });
  });

  /* Initialize dashboard on load */
  updateStatsAndTasks();
  loadEmployees();
  document.getElementById("greetingText").textContent =
    `Welcome, ${currentUser.name}`;
  document.getElementById("userDetails").textContent = "Role: Manager";
});

/* ===== Employee Dashboard Page Logic ===== */

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "employee") {
    // For now, continue instead of redirecting to allow dashboard to load
  }

  /* Task rendering */
  window.renderMyTasks = function () {
    const tasks = getTasks().filter(
      (t) => t.employee.toLowerCase() === currentUser.name.toLowerCase(),
    );
    const employeeStatsEl = document.getElementById("employeeStats");
    if (employeeStatsEl) {
      employeeStatsEl.innerHTML = `
        <div class="stat-card"><h3>${tasks.length}</h3><p>Total Tasks</p></div>
        <div class="stat-card"><h3>${tasks.filter((t) => t.status === "active").length}</h3><p>Active</p></div>
        <div class="stat-card"><h3>${tasks.filter((t) => t.status === "completed").length}</h3><p>Completed</p></div>
        <div class="stat-card"><h3>${tasks.filter((t) => t.status === "failed").length}</h3><p>Failed</p></div>
      `;
    }
    const container = document.getElementById("myTasksContainer");
    if (container) {
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
    }}

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
      // Close mobile sidebar after navigation
      if (document.body.classList.contains("sidebar-open")) {
        document.body.classList.remove("sidebar-open");
      }
    });
  });

  /* Initialize dashboard on load */
  renderMyTasks();
  document.getElementById("greetingText").textContent =
    `Welcome, ${currentUser.name}`;
  document.getElementById("userDetails").textContent = "Role: Employee";
});

/* Mobile sidebar toggle (shared) */
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("mobileMenuBtn");
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    document.body.classList.toggle("sidebar-open");
  });

  // Close sidebar when clicking outside it
  document.addEventListener("click", function (e) {
    if (!document.body.classList.contains("sidebar-open")) return;
    if (
      e.target.closest(".dashboard-sidebar") ||
      e.target.closest("#mobileMenuBtn")
    )
      return;
    document.body.classList.remove("sidebar-open");
  });

  // Close on ESC
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      document.body.classList.contains("sidebar-open")
    ) {
      document.body.classList.remove("sidebar-open");
    }
  });

  // Close button(s) inside sidebar
  document.querySelectorAll(".sidebar-close-btn").forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      document.body.classList.remove("sidebar-open");
    });
  });
});

/* Consolidated Theme Toggle & Logout (shared across all dashboards) */
(() => {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      this.querySelector("i").classList.toggle("fa-moon");
      this.querySelector("i").classList.toggle("fa-sun");
    });
  }

  window.logout = function () {
    sessionStorage.removeItem("currentUser");
    window.location.href = "index.html";
  };
})();
