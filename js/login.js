
document.addEventListener("DOMContentLoaded", function () {
    
    
    const loginForm = document.querySelector(".sign-in-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
    
            const Email = document.getElementById('email').value.trim();
            const Password = document.getElementById('password').value;
    
            if (!Email || !Password) {
                alert("Both email and password are required!");
                return;
            }
    
            try {
                const formData = new FormData();
                formData.append("Email", Email);
                formData.append("Password", Password);
    
                const response = await fetch("https://localhost:7043/api/Auth/Login", {
                    method: "POST",
                    body: formData
                });
    
                if (response.ok) {
                    console.log("success")
                    var data = await response.json();
                    localStorage.setItem("token", data['token']);
                    localStorage.setItem("type", data['type']);
                    
                    // الانتقال إلى صفحة الهوم
                    window.location.href ="Home.html";
                } else {
                    const errorData = await response.text();
                    console.log("Login failed:", errorData);
                    alert("Login failed: " + errorData);
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred during login.");
            }
        });
    }
});