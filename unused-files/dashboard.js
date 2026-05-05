// Dashboard common functions
function protectDashboard(requiredRole) {
  if (!session.isValid(requiredRole)) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function loadUserProfile() {
  const user = session.get();
  if (user) {
    // Update profile elements
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userRole").textContent = user.role.toUpperCase();
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userEmpID").textContent = user.empID;

    // Set welcome message
    const greeting = document.getElementById("greetingText");
    if (greeting) {
      greeting.textContent = `Welcome, ${user.name}`;
    }

    return user;
  }
  return null;
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      session.clear();
      window.location.href = "login.html";
    });
  }
}

function initDashboard(requiredRole) {
  if (!protectDashboard(requiredRole)) return;
  const user = loadUserProfile();
  setupLogout();
  return user;
}
