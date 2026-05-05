// Provides: AUTH_CODES, initUsers(), authenticate(), session, users

/* Authorization codes for role-based access control */
const AUTH_CODES = {
  admin: "ADMIN123",
  manager: "MANAGER456",
};

/* Initialize default users if none exist in localStorage */
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

/* Authenticate user with username/email and password */
function authenticate(username, password, role = null) {
  const users = JSON.parse(localStorage.getItem("emsUsers")) || [];
  return users.find(
    (user) =>
      (user.username === username ||
        user.email === username ||
        user.empID === username) &&
      user.password === password &&
      (!role || user.role === role) &&
      user.isActive,
  );
}

/* Session management utilities */
const session = {
  set: (user) => localStorage.setItem("currentUser", JSON.stringify(user)),
  get: () => JSON.parse(localStorage.getItem("currentUser")),
  clear: () => localStorage.removeItem("currentUser"),
  isValid: (requiredRole) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user && (!requiredRole || user.role === requiredRole);
  },
};

/* Users helper (minimal) */
const users = {
  getAll: () => JSON.parse(localStorage.getItem("emsUsers")) || [],
  getById: (id) => users.getAll().find((u) => u.id === id),
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

function generateEmployeeID(role) {
  const prefix =
    {
      admin: "ADM",
      manager: "MGR",
      employee: "EMP",
    }[role] || "USR";

  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

// Initialize users on script load
initUsers();
