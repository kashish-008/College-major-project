/* ===== Manager Login Form Handler ===== */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("managerLoginForm");
  if (!form) {
    console.error("managerLoginForm not found");
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
