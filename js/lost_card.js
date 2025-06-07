document.addEventListener("DOMContentLoaded", function () {

    const registerCardForm = document.querySelector(".lost-card-form");
    if (registerCardForm) {
        registerCardForm.addEventListener("submit", async function (event) {
            event.preventDefault();
    
            const CardID = document.getElementById('national_id').value.trim();
            const Government = document.getElementById('government').value.trim();
            const Center = document.getElementById('center').value.trim();
            const Street = document.getElementById('street').value.trim();
            const fileInput = document.getElementById('fileInput').value;
            const ForiegnKey_UserEmail = document.getElementById('email').value.trim();
    
            if (!CardID || !Government|| !Center || !Street || !ForiegnKey_UserEmail) {
                alert("Data are required!");
                return;
            }
    
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append("CardID", CardID);
                formData.append("Government", Government);
                formData.append("Center", Center);
                formData.append("Street", Street);
                formData.append("fileInput", fileInput);
                formData.append("ForiegnKey_UserEmail", ForiegnKey_UserEmail);
                
                
                const response = await fetch("https://localhost:7043/api/Lost_Card/Add Losted Card", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${token}`  // Include JWT token in the header
                    }
                });
    
                if (response.ok) {
                    const data = await response.text();
                    console.log("success add")
                    // الانتقال إلى صفحة الهوم
                    window.location.href ="card.html";
                } else {
                    const errorData = await response.text();
                    console.log("Submit failed:", errorData);
                    alert("Submit failed: " + errorData);
                }
            } catch (error) {
                console.error("Submit error:", error);
                alert("An error occurred during Submit  .");
            }
        });
    }

});
