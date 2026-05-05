/* ===== Contact Form Handler & FAQ Accordion ===== */
document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initFAQAccordion();
});

/* Contact Form Handler */
function initContactForm() {
  // Initialize localStorage if not exists
  if (!localStorage.getItem("emsContacts")) {
    localStorage.setItem("emsContacts", JSON.stringify([]));
  }

  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const messageDiv = document.getElementById("formMessage");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");

    if (!name || !email || !message) {
      showContactMessage("Please fill all fields", "error");
      return;
    }

    if (!validateEmail(email)) {
      showContactMessage("Please enter a valid email", "error");
      return;
    }

    // Show loader
    btnText.style.display = "none";
    btnLoader.style.display = "inline";
    submitBtn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
      const contacts = JSON.parse(localStorage.getItem("emsContacts"));
      const newContact = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString(),
      };
      contacts.push(newContact);
      localStorage.setItem("emsContacts", JSON.stringify(contacts));

      showContactMessage(
        "Message sent successfully! We'll get back to you soon.",
        "success",
      );
      form.reset();

      // Reset button
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
      submitBtn.disabled = false;
    }, 800);
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showContactMessage(text, type) {
    const messageDiv = document.getElementById("formMessage");
    messageDiv.textContent = text;
    messageDiv.className = "form-message " + type;
    if (type === "success") {
      setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.className = "form-message";
      }, 5000);
    }
  }
}

/* FAQ Accordion */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      item.classList.toggle("active");
    });
  });
}

/* ===== Registration Form Handler ===== */
document.addEventListener("DOMContentLoaded", function () {
  const roleSelect = document.getElementById("role");
  if (!roleSelect) return; // Exit if not on registration page

  const extraField = document.getElementById("extraField");
  const extraInput = document.getElementById("extraInput");
  const extraLabel = document.getElementById("extraLabel");
  const form = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const matchError = document.getElementById("passwordMatchError");

  if (!form) return;

  /* Role-based extra field display */
  roleSelect.addEventListener("change", function () {
    const role = this.value;
    if (role === "admin") {
      extraLabel.textContent = "Admin Access Code";
      extraInput.placeholder = "Enter ADMIN123";
      extraInput.required = true;
      extraField.style.display = "block";
    } else if (role === "manager") {
      extraLabel.textContent = "Manager Code";
      extraInput.placeholder = "Enter MANAGER456";
      extraInput.required = true;
      extraField.style.display = "block";
    } else {
      extraField.style.display = "none";
      extraInput.required = false;
    }
  });

  /* Form submission */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const role = roleSelect.value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value.trim();
    const code = extraInput.value.trim();
    const confirmPassword = confirmInput.value.trim();
    const termsChecked = document.getElementById("termsCheckbox").checked;

    if (!role || !name || !email || !password) {
      alert("Please fill all required fields");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!termsChecked) {
      alert("You must agree to the Terms of Service");
      return;
    }

    if (
      (role === "admin" && code !== AUTH_CODES.admin) ||
      (role === "manager" && code !== AUTH_CODES.manager)
    ) {
      alert("Invalid access code");
      return;
    }

    if (users.getAll().some((u) => u.email === email)) {
      alert("Email already registered");
      return;
    }

    const newUser = users.add({
      username: email.split("@")[0],
      password: password,
      role: role,
      name: name,
      email: email,
    });

    session.set(newUser);
    alert(`Registration successful! Welcome ${name}`);
    window.location.href = `${role}-dashboard.html`;
  });

  /* Password visibility toggles */
  function setupToggle(buttonId, inputId) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener("click", function () {
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }

  setupToggle("togglePassword", "password");
  setupToggle("toggleConfirmPassword", "confirmPassword");

  /* Password strength indicator */
  passwordInput.addEventListener("input", function () {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length >= 8) strength++;
    if (val.match(/[a-z]+/)) strength++;
    if (val.match(/[A-Z]+/)) strength++;
    if (val.match(/[0-9]+/)) strength++;
    if (val.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)) strength++;

    const percentage = (strength / 5) * 100;
    strengthBar.style.width = percentage + "%";

    if (strength <= 2) {
      strengthBar.style.background = "#ef4444";
      strengthText.textContent = "Weak";
      strengthText.style.color = "#ef4444";
    } else if (strength === 3) {
      strengthBar.style.background = "#f59e0b";
      strengthText.textContent = "Fair";
      strengthText.style.color = "#f59e0b";
    } else if (strength === 4) {
      strengthBar.style.background = "#10b981";
      strengthText.textContent = "Good";
      strengthText.style.color = "#10b981";
    } else if (strength === 5) {
      strengthBar.style.background = "#059669";
      strengthText.textContent = "Strong";
      strengthText.style.color = "#059669";
    }
  });

  /* Real-time password match check */
  confirmInput.addEventListener("input", function () {
    if (confirmInput.value && confirmInput.value !== passwordInput.value) {
      matchError.textContent = "Passwords do not match";
      matchError.style.color = "#ef4444";
    } else if (confirmInput.value) {
      matchError.textContent = "Passwords match";
      matchError.style.color = "#10b981";
    } else {
      matchError.textContent = "";
    }
  });
});
