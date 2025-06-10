const lostItemInput = document.getElementById("lostSearch");
const searchTypeSelect = document.getElementById("SearchTypID");
const emailInput = document.getElementById("email");
const typeSearchDiv = document.getElementById("searchType_div");
const form = document.getElementById("Check-lostItems-form");
let foundItems = document.getElementById("foundItemsId");
let formSection = document.getElementById("formSection");
let a = [
  {
    text_similarity: 0.5878,
    face_verified: true,
    face_distance: 0,
    match_result: false,
    face_images: {
      lost_face: "http://localhost:8001/static/lostedcard/...",
      found_face: "http://localhost:8001/static/foundedcard/...",
    },
    contact_info: {
      found: "beboomagdy22@gmail.com",
    },
  },
  {
    text_similarity: 0.5878,
    face_verified: true,
    face_distance: 0,
    match_result: false,
    face_images: {
      lost_face: "http://localhost:8001/static/lostedcard/...",
      found_face: "http://localhost:8001/static/foundedcard/...",
    },
    contact_info: {
      found: "beboomagdy22@gmail.com",
    },
  },
  {
    text_similarity: 0.5878,
    face_verified: true,
    face_distance: 0,
    match_result: false,
    face_images: {
      lost_face: "http://localhost:8001/static/lostedcard/...",
      found_face: "http://localhost:8001/static/foundedcard/...",
    },
    contact_info: {
      found: "beboomagdy22@gmail.com",
    },
  },
];
document.addEventListener("DOMContentLoaded", function () {
  // إظهار أو إخفاء نوع البحث
  lostItemInput.addEventListener("change", function () {
    const value = lostItemInput.value.trim();
    if (value !== "") {
      typeSearchDiv.classList.remove("d-none");
      typeSearchDiv.classList.add("d-flex");
      clearErrors();
    } else {
      typeSearchDiv.classList.add("d-none");
      typeSearchDiv.classList.remove("d-flex");
    }
  });

  // عند إرسال الفورم
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const lostItem = lostItemInput.value.trim();
    // const searchType = {
    //   Image: "I",
    //   Text: 1,
    //   Both: 2,
    // };

    const searchTypeSelectValue = searchTypeSelect.value;
    const email = emailInput.value.trim();

    let hasError = false;

    if (!lostItem) {
      showError("err_lostSearch_id", "Lost item is required");
      hasError = true;
    }

    if (!searchTypeSelectValue) {
      showError("err_SearchTyp_id", "Search Type is required");
      hasError = true;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showError("err_email", "Valid email is required");
      hasError = true;
    }

    if (hasError) return;

    if (searchTypeSelectValue == "Image") {
      await getFoundDataFromAPI(lostItem, email, searchTypeSelectValue);
    } else if (searchTypeSelectValue == "Text") {
      await getFoundDataFromAPI(lostItem, email, searchTypeSelectValue);
    } else if (searchTypeSelectValue == "Both") {
      await getFoundDataFromAPI(lostItem, email, searchTypeSelectValue);
    }

    // showFoundItems(a, lostItem, searchTypeSelectValue);
  });

  function clearErrors() {
    showError("err_lostSearch_id", "");
    showError("err_SearchTyp_id", "");
    showError("err_email", "");
  }

  function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
  }

  function resetForm() {
    lostItemInput.value = "";
    searchTypeSelect.value = "";
    emailInput.value = "";
  }
});

async function getFoundDataFromAPI(item, email, matchType) {
  if (item === "card") {
    const token = localStorage.getItem("token");
    $.ajax({
      url: `https://localhost:7043/api/Checking_For_Items/matchCard?email=${encodeURIComponent(
        email
      )}&matchType=${encodeURIComponent(matchType)}`,
      type: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        showFoundItems(data, lostItem, matchType);

        if (data.length === 0) {
          // alert("⚠ No matching cards were found.");
          ShowBootstrapToast("No matching cards were found", "danger");
        } else {
          // alert("Matching complete! Check console for results.");
          ShowBootstrapToast(
            " Matching complete, Wati for showing your matching  ",
            "success",
            true
          );
        }
      },
      error: function (xhr, status, error) {
        let message = "Unexpected error occurred.";

        if (xhr.status === 400) {
          message = xhr.responseText;
        } else if (xhr.status === 500) {
          message = "Server Error: " + xhr.responseText;
        } else if (xhr.status === 0) {
          message = "Request failed. Are you offline or is the server down?";
        }

        console.error("Error Details:", {
          status: xhr.status,
          response: xhr.responseText,
          error: error,
        });

        ShowBootstrapToast(message, "danger");
      },
    });
  } else if (item === "Phone") {
    const token = localStorage.getItem("token");
    $.ajax({
      url: `https://localhost:7043/api/Checking_For_Items/matchPhone?email=${encodeURIComponent(
        email
      )}&matchType=${encodeURIComponent(matchType)}`,
      type: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        showFoundItems(data, lostItem, matchType);

        if (data.length === 0) {
          alert("No matching cards were found.");
        } else {
          alert("Matching complete! Check console for results.");
          ShowBootstrapToast(
            " Matching complete! Check console for results ",
            "success",
            true
          );
          showFoundItems(data, item, matchType);
        }
      },
      error: function (xhr, status, error) {
        let message = "Unexpected error occurred.";

        if (xhr.status === 400) {
          message = xhr.responseText;
        } else if (xhr.status === 500) {
          message = "Server Error: " + xhr.responseText;
        } else if (xhr.status === 0) {
          message = "Request failed. Are you offline or is the server down?";
        }

        console.error("Error Details:", {
          status: xhr.status,
          response: xhr.responseText,
          error: error,
        });

        ShowBootstrapToast(message, "danger");
      },
    });
  }
}

function showFormAgain() {
  foundItems.classList.remove("d-flex");
  foundItems.classList.add("d-none");
  formSection.classList.remove("d-none");
  formSection.classList.add("d-flex");

  // مسح الفورم
  document.getElementById("lostSearch").value = "";
  document.getElementById("SearchTypID").value = "";
  document.getElementById("email").value = "";
  document.getElementById("searchType_div").classList.add("d-none");
  document.querySelector("#link").classList.add("d-none");
  document.querySelector("#link").classList.remove("d-block");
}

document.querySelector("#link a").addEventListener("click", () => {
  showFormAgain();
});

function showFoundItems(items, lostItem, searchTypeItem) {
  let arrItms = items;
  foundItems.innerHTML = "";
  formSection.classList.remove("d-flex");
  formSection.classList.add("d-none");
  foundItems.classList.remove("d-none");
  foundItems.classList.add("d-flex");
  document.querySelector("#link").classList.remove("d-none");
  document.querySelector("#link").classList.add("d-block");

  if (!arrItms || arrItms.length === 0) {
    return;
  }

  ShowBootstrapToast("Cards Found", "success", true);

  arrItms.forEach((e) => {
    let createDivParent = document.createElement("div");
    createDivParent.classList.add("card", "mb-3", "p-3");
    createDivParent.style.width = "20rem";
    foundItems.appendChild(createDivParent);

    let createMainHeder = document.createElement("h4");
    createMainHeder.classList.add("text-center");
    createMainHeder.textContent = `${lostItem} has been found`;
    createDivParent.appendChild(createMainHeder);

    if (searchTypeItem !== "Text") {
      let createMainDiveImgs = document.createElement("div");
      createMainDiveImgs.classList.add(
        "d-flex",
        "justify-content-between",
        "mb-3",
        "text-center"
      );
      createDivParent.appendChild(createMainDiveImgs);

      let createLostImg = document.createElement("div");
      createLostImg.classList.add("me-3");
      createMainDiveImgs.appendChild(createLostImg);

      let createLostHeader = document.createElement("h5");
      createLostHeader.classList.add("card-title");
      createLostHeader.textContent = "Lost Image";

      let createLostImageSRC = document.createElement("img");
      createLostImageSRC.classList.add(
        "card-img-top",
        "border",
        "border-3",
        "border-danger"
      );
      createLostImageSRC.src = e.face_images.lost_face;
      createLostImageSRC.alt = "No Image Found";
      createLostImageSRC.style.maxWidth = "150px";
      createLostImageSRC.style.height = "auto";

      createLostImg.appendChild(createLostHeader);
      createLostImg.appendChild(createLostImageSRC);

      let createFoundImg = document.createElement("div");
      createMainDiveImgs.appendChild(createFoundImg);

      let createFoundHeader = document.createElement("h5");
      createFoundHeader.classList.add("card-title");
      createFoundHeader.textContent = "Found Image";

      let createFoundImageSRC = document.createElement("img");
      createFoundImageSRC.classList.add(
        "card-img-top",
        "border",
        "border-3",
        "border-success"
      );
      createFoundImageSRC.src = e.face_images.found_face;
      createFoundImageSRC.alt = "No Found Image";
      createFoundImageSRC.style.maxWidth = "150px";
      createFoundImageSRC.style.height = "auto";

      createFoundImg.appendChild(createFoundHeader);
      createFoundImg.appendChild(createFoundImageSRC);
    }

    let createDivData = document.createElement("div");
    createDivData.classList.add("card-body");

    let TextSimilarity = document.createElement("h5");
    TextSimilarity.classList.add("card-title", "d-block", "mb-2");
    TextSimilarity.innerHTML = `Text Similarity: <span class="text-success">${e.text_similarity}</span>`;

    let FaceVerified = document.createElement("h5");
    FaceVerified.classList.add("card-title", "d-block", "mb-2");
    FaceVerified.innerHTML = `Face Verified: <span class="text-success">${
      e.face_verified ? "True" : "False"
    }</span>`;

    let FaceDistance = document.createElement("h5");
    FaceDistance.classList.add("card-title", "d-block", "mb-2");
    FaceDistance.innerHTML = `FaceDistance: <span class="text-success">${e.face_distance}</span>`;

    let MatchResult = document.createElement("h5");
    MatchResult.classList.add("card-title", "d-block", "mb-2");
    MatchResult.innerHTML = `Match Result: <span class="text-success">${
      e.match_result ? "Match" : "Not Match"
    }</span>`;

    let ContactInfo = document.createElement("h5");
    ContactInfo.classList.add("card-title", "d-block", "mb-2");
    ContactInfo.innerHTML = `Contact Info: <span class="text-success">${e.contact_info.found}</span>`;

    createDivParent.appendChild(createDivData);
    createDivData.appendChild(TextSimilarity);
    createDivData.appendChild(FaceVerified);
    createDivData.appendChild(FaceDistance);
    createDivData.appendChild(MatchResult);
    createDivData.appendChild(ContactInfo);
  });
}

// -----------------------  TostBox (Popup Message)    ----------------------------------
window.ShowBootstrapToast = function (
  message,
  type = "Info",
  withButtons = false
) {
  const toastId = "custom-toast-" + Date.now();
  const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type.toLowerCase()} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body w-100">
                        ${message}
                        ${
                          withButtons
                            ? `
                        <div class="mt-2 pt-2 border-top d-flex justify-content-end gap-2">
                            <button type="button" class="btn btn-light btn-sm" id="btn-add-new">Check another Item</button>
                            <button type="button" class="btn btn-outline-light btn-sm" id="btn-go-home">Go Home</button>
                        </div>`
                            : ""
                        }
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(toastContainer);
  }

  toastContainer.innerHTML += toastHTML;

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 7000 });
  toast.show();

  if (withButtons) {
    toastElement
      .querySelector("#btn-add-new")
      .addEventListener("click", function () {
        showFormAgain();
        $("#Check-lostItems-form")[0].reset();
        $("#preview").attr(
          "src",
          "../../images/id-card-illustration_23-2147829294.avif"
        );
        $(".error-msg").text("");
        toast.hide();
      });

    toastElement
      .querySelector("#btn-go-home")
      .addEventListener("click", function () {
        window.location.replace("../../../index.html");
      });
  }

  toastElement.addEventListener("hidden.bs.toast", function () {
    toastElement.remove();
  });
};
