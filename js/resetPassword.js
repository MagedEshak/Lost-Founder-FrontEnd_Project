document
  .getElementById("resetForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById(
      "confirmPasswordError"
    );

    // Reset errors
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    passwordError.classList.remove("text-danger");
    confirmPasswordError.classList.remove("text-danger");

    let isValid = true;

    if (!newPassword) {
      passwordError.textContent = "Password is required.";
      passwordError.classList.add("text-danger");
      isValid = false;
    } else if (newPassword.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters.";
      passwordError.classList.add("text-danger");
      isValid = false;
    }

    if (!confirmPassword) {
      confirmPasswordError.textContent = "Confirm Password is required.";
      confirmPasswordError.classList.add("text-danger");
      isValid = false;
    }

    if (!isValid) return;

    if (newPassword !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match.";
      confirmPasswordError.classList.add("text-danger");
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7043/api/Auth/ResetPassword",
        {
          method: "POST",
          body: JSON.stringify({ token, newPassword }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showAlert(
          "Password has been reset. Redirecting to login...",
          "success"
        );
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        showAlert("Failed to reset password", "danger");
      }
    } catch (error) {
      showAlert("Something went wrong.", "info");
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
  }, 9000);
}
