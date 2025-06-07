document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".sign-in-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const Email = document.getElementById("email").value.trim();
      const Password = document.getElementById("password").value;
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");

      emailError.textContent = "";
      passwordError.textContent = "";
      let isValid = true;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (Email == "") {
        emailError.textContent = "Email is required";
        emailError.classList.add("text-danger");
        isValid = false;
      } else if (!emailPattern.test(Email)) {
        emailError.textContent = "It is must be email ";
        isValid = false;
      }

      if (Password === "") {
        passwordError.textContent = "Password is required";
        passwordError.classList.add("text-danger");
        isValid = false;
      }
      if (isValid) {
        try {
          const formData = new FormData();
          formData.append("Email", Email);
          formData.append("Password", Password);

          const response = await fetch(
            "https://localhost:7043/api/Auth/Login",
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            console.log("success");
            var data = await response.json();
            localStorage.setItem("token", data["token"]);
            localStorage.setItem("type", data["type"]);

            // الانتقال إلى صفحة الهوم
            window.location.href = "Home.html";
          } else {
            const errorData = await response.text();
            console.log("Login failed:", errorData);
          }
        } catch (error) {
          console.error("Login error:", error);
          alert("An error occurred during login.");
        }
      }
    });
  }
});
