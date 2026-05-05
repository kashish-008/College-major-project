/* ===== Employee Login Form Handler ===== */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("employeeLoginForm");
  if (!form) {
    console.error("employeeLoginForm not found");
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
