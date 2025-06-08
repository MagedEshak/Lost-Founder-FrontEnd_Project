document
  .getElementById("forgetForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const emailError = document.getElementById("emailError");

    emailError.textContent = "";

    if (!email) {
      emailError.textContent = "Email is required";
      emailError.classList.add("text-danger");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      emailError.textContent = "Enter a valid email";
      emailError.classList.add("text-danger");
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7043/api/Auth/RequestPasswordReset",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showAlert("Check your email for reset instructions.", "success");
      } else {
        showAlert("Email not found or server error.", "danger");
      }
    } catch (error) {
      showAlert("Something went wrong. Try again", "info");
    }
  });
function showAlert(message, type = "success") {
  const alertBox = document.getElementById("alertBox");
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type} mt-3`; // success, danger, warning, etc.
  alertBox.classList.remove("d-none");

  // Auto-hide after 3 seconds
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 3000);
}
