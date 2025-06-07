document.addEventListener("DOMContentLoaded", function () {

    const registerCardForm = document.querySelector(".find-phone-form");
    if (registerCardForm) {
        registerCardForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const Color = document.getElementById('phone-color').value.trim();
            const Brand = document.getElementById('phone-brand').value.trim();
            const PhoneNumber = document.getElementById('serial_number').value.trim();
            const Government = document.getElementById('government').value.trim();
            const Center = document.getElementById('center').value.trim();
            const Street = document.getElementById('street').value.trim();
            const fileInput = document.getElementById('fileInput').files[0];  // الصورة كـ File object
            const FinderEmail = document.getElementById('email').value.trim();

            if (!PhoneNumber || !Brand || !Color || !Government || !Center || !Street || !FinderEmail) {
                alert("All fields are required (image is optional)!");
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append("PhoneNumber", PhoneNumber);
                formData.append("Government", Government);
                formData.append("Center", Center);
                formData.append("Street", Street);
                formData.append("FinderEmail", FinderEmail);
                formData.append("Color", Color);
                formData.append("Brand", Brand);

                // ✅ ضيف الصورة فقط لو المستخدم اختارها
                if (fileInput) {
                    formData.append("PhonePhoto", fileInput);
                }

                const response = await fetch("https://localhost:7043/api/Find_Phone/Add find phone", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${token}`  // Include JWT token in the header
                    }
                });

                if (response.ok) {
                    const data = await response.text();
                    console.log("Success add");
                    window.location.href = "phone2.html";
                } else {
                    const errorData = await response.text();
                    console.log("Submit failed:", errorData);
                    alert("Submit failed: " + errorData);
                }
            } catch (error) {
                console.error("Submit error:", error);
                alert("An error occurred during submission.");
            }
        });
    }

});
