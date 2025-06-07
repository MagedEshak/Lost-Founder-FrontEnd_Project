document.addEventListener("DOMContentLoaded", function () {

    const registerCardForm = document.querySelector(".lost-phone-form");
    if (registerCardForm) {
        registerCardForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const Color = document.getElementById('phone-color').value.trim();
            const Brand = document.getElementById('phone-brand').value.trim();
            const PhoneNumber = document.getElementById('serial_number').value.trim();
            const Government = document.getElementById('government').value.trim();
            const Center = document.getElementById('center').value.trim();
            const Street = document.getElementById('street').value.trim();
            const fileInput = document.getElementById('fileInput').value;
            const ForiegnKey_UserEmail = document.getElementById('email').value.trim();
    
            if  (!PhoneNumber || !Brand || !Color || !Government || !Center || !Street || !ForiegnKey_UserEmail ) {
                alert("Data are required!");
                return;
            }
    
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append("PhoneNumber", PhoneNumber);
                formData.append("Government", Government);
                formData.append("Center", Center);
                formData.append("Street", Street);
                formData.append("fileInput", fileInput);
                formData.append("ForiegnKey_UserEmail", ForiegnKey_UserEmail);
                formData.append("Color", Color);
                formData.append("Brand", Brand);
                
                
                const response = await fetch("https://localhost:7043/api/Lost_Phone/Add Losted Phone", {
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
                    window.location.href ="phone.html";
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