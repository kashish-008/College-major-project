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
      showMessage("Please fill all fields", "error");
      return;
    }

    if (!validateEmail(email)) {
      showMessage("Please enter a valid email", "error");
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

      showMessage(
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

  function showMessage(text, type) {
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
