/* ===== Employee Login Form Handler ===== */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("employeeLoginForm");
  if (!form) {
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) {
    console.error("submitBtn not found");
    return;
  }

  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoader = submitBtn.querySelector(".btn-loader");
  const messageDiv = document.getElementById("formMessage");

  if (!btnText || !btnLoader) {
    console.error("btn-text or btn-loader not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("employeeID").value.trim();
    const password = document.getElementById("employeePassword").value.trim();

    console.log("Employee login attempt - Username/ID:", username);

    if (!username || !password) {
      showMessage("Please fill all fields", "error");
      return;
    }

    // Show loader
    btnText.style.display = "none";
    btnLoader.style.display = "inline-flex";
    submitBtn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
      console.log("Authenticating employee user...");
      const user = authenticate(username, password, "employee");
      console.log("Authentication result:", user);

      if (user) {
        console.log("Employee authenticated. Redirecting to dashboard...");
        session.set(user);
        window.location.href = "employee-dashboard.html";
      } else {
        console.log("Authentication failed for employee. Invalid credentials");
        showMessage(
          "Invalid employee credentials. Try: employee / employee123",
          "error",
        );
        btnText.style.display = "inline";
        btnLoader.style.display = "none";
        submitBtn.disabled = false;
      }
    }, 600);
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = "form-message " + type;
    console.log("Message shown:", text, type);
  }

  // Password toggle
  const toggleBtn = document.getElementById("toggleEmployeePassword");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const pwd = document.getElementById("employeePassword");
      const type =
        pwd.getAttribute("type") === "password" ? "text" : "password";
      pwd.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }
});

/* ===== Admin Login Form Handler ===== */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("adminLoginForm");
  if (!form) {
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) {
    console.error("submitBtn not found");
    return;
  }

  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoader = submitBtn.querySelector(".btn-loader");
  const messageDiv = document.getElementById("formMessage");

  if (!btnText || !btnLoader) {
    console.error("btn-text or btn-loader not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const code = document.getElementById("adminCode").value.trim();

    console.log("Login attempt - Username:", username, "Code:", code);

    if (!username || !password || !code) {
      showMessage("Please fill all fields", "error");
      return;
    }

    if (!AUTH_CODES || !AUTH_CODES.admin) {
      showMessage("System error: AUTH_CODES not configured", "error");
      console.error("AUTH_CODES not found:", AUTH_CODES);
      return;
    }

    if (code !== AUTH_CODES.admin) {
      console.log("Code mismatch. Expected:", AUTH_CODES.admin, "Got:", code);
      showMessage(
        "Invalid admin access code. Expected: " + AUTH_CODES.admin,
        "error",
      );
      return;
    }

    // Show loader
    btnText.style.display = "none";
    btnLoader.style.display = "inline-flex";
    submitBtn.disabled = true;

    console.log("Authenticating admin user...");
    const user = authenticate(username, password, "admin");
    console.log("Authentication result:", user);

    if (user) {
      console.log("User authenticated. Setting session and redirecting...");
      session.set(user);
      console.log(
        "Session set in localStorage. Current User:",
        JSON.parse(localStorage.getItem("currentUser")),
      );
      console.log("Redirecting to admin-dashboard.html");
      // Add a small delay to ensure localStorage is written
      setTimeout(() => {
        window.location.href = "admin-dashboard.html";
      }, 100);
    } else {
      console.log(
        "Authentication failed. Invalid credentials for username:",
        username,
      );
      showMessage("Invalid admin credentials. Try: admin / admin123", "error");
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = "form-message " + type;
    console.log("Message shown:", text, type);
  }

  // Password toggle
  const toggleBtn = document.getElementById("toggleAdminPassword");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const pwd = document.getElementById("adminPassword");
      const type =
        pwd.getAttribute("type") === "password" ? "text" : "password";
      pwd.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }
});

/* ===== Manager Login Form Handler ===== */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("managerLoginForm");
  if (!form) {
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) {
    console.error("submitBtn not found");
    return;
  }

  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoader = submitBtn.querySelector(".btn-loader");
  const messageDiv = document.getElementById("formMessage");

  if (!btnText || !btnLoader) {
    console.error("btn-text or btn-loader not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("managerUsername").value.trim();
    const password = document.getElementById("managerPassword").value.trim();
    const code = document.getElementById("managerCode")
      ? document.getElementById("managerCode").value.trim()
      : "";

    console.log("Manager login attempt - Username:", username);

    if (!username || !password) {
      showMessage("Please fill all fields", "error");
      return;
    }

    if (!AUTH_CODES || !AUTH_CODES.manager) {
      showMessage("System error: AUTH_CODES not configured", "error");
      console.error("AUTH_CODES not found:", AUTH_CODES);
      return;
    }

    // Check manager code if provided
    if (code && code !== AUTH_CODES.manager) {
      console.log("Code mismatch. Expected:", AUTH_CODES.manager, "Got:", code);
      showMessage("Invalid manager access code", "error");
      return;
    }

    // Show loader
    btnText.style.display = "none";
    btnLoader.style.display = "inline-flex";
    submitBtn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
      console.log("Authenticating manager user...");
      const user = authenticate(username, password, "manager");
      console.log("Authentication result:", user);

      if (user) {
        console.log("Manager authenticated. Redirecting to dashboard...");
        session.set(user);
        window.location.href = "manager-dashboard.html";
      } else {
        console.log("Authentication failed for manager. Invalid credentials");
        showMessage(
          "Invalid manager credentials. Try: manager / manager123",
          "error",
        );
        btnText.style.display = "inline";
        btnLoader.style.display = "none";
        submitBtn.disabled = false;
      }
    }, 600);
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = "form-message " + type;
    console.log("Message shown:", text, type);
  }

  // Password toggle
  const toggleBtn = document.getElementById("toggleManagerPassword");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const pwd = document.getElementById("managerPassword");
      const type =
        pwd.getAttribute("type") === "password" ? "text" : "password";
      pwd.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }
});
