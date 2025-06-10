document.addEventListener("DOMContentLoaded", function () {
  const lostItemInput = document.getElementById("lostSearch");
  const searchTypeSelect = document.getElementById("SearchTypID");
  const emailInput = document.getElementById("email");
  const typeSearchDiv = document.getElementById("searchType_div");
  const form = document.getElementById("Check-lostItems-form");

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

async function getFoundDataFromAPI(item, email, matchType = "Image") {
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
        console.log("Matched Cards:", data);
        showFoundItems(data, lostItem, searchTypeItem);

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
        console.log("Matched Cards:", data);

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

let foundItems = document.getElementById("foundItemsId");
let formSection = document.getElementById("formSection");

function showFoundItems(items, lostItem, searchTypeItem) {
  let arrItms = items;
  foundItems.innerHTML = "";

  if (!arrItms || arrItms.length === 0) {
    return arrItms;
  } else {
    ShowBootstrapToast("Cards Found", "success", true);
    foundItems.classList.remove("d-flex");
    formSection.classList.add("d-none");

    foundItems.classList.remove("d-none");
    foundItems.classList.add("d-flex");

    arrItms.forEach((e) => {
      let createDivParent = document.createElement("div");
      createDivParent.classList.add("card mb-3 p-3");
      createDivParent.style.width = "20rem";
      foundItems.append(createDivParent);

      let createMainHeder = document.createElement("h4");
      createMainHeder.classList.add("text-center");
      createMainHeder.textContent = `Found ${lostItem}`;
      createDivParent.append(createMainHeder);

      if (searchTypeItem !== "Text") {
        let createMainDiveImgs = document.createElement("div");
        createMainDiveImgs.classList.add(
          "d-flex justify-content-between mb-3 text-center"
        );
        createDivParent.append(createMainDiveImgs);

        let createLostImg = document.createElement("div");
        createLostImg.classList.add("me-3");
        createMainDiveImgs.append(createLostImg);

        let createLostHeader = document.createElement("h5");
        createLostHeader.classList.add("card-title");
        createLostHeader.textContent = "Lost Image";

        let createLostImageSRC = document.createElement("img");
        createLostImageSRC.classList.add(
          "card-img-top border border-3 border-danger"
        );

        createLostImageSRC.src = `${e.face_images.lost_face}`;
        createLostImg.append(createLostHeader);
        createLostImg.append(createLostImageSRC);

        let createFoundImg = document.createElement("div");
        createMainDiveImgs.append(createFoundImg);

        let createFoundHeader = document.createElement("h5");
        createFoundHeader.classList.add("card-title");
        createFoundHeader.textContent = "Found Image";

        let createFoundImageSRC = document.createElement("img");
        createFoundImageSRC.classList.add(
          "card-img-top border border-3 border-danger"
        );

        createFoundImageSRC.src = `${e.face_images.found_face}`;
        createFoundImg.append(createFoundHeader);
        createFoundImg.append(createFoundImageSRC);

        createDivParent.append(createMainDiveImgs);
      }

      let createDivData = document.createElement("div");
      createDivData.classList.add("card-body");

      //------------------- Text Similarity -------------------------------
      let TextSimilarity = document.createElement("h5");
      TextSimilarity.classList.add("card-title d-inline");

      let TextSimilaritySpan = document.createElement("span");
      TextSimilaritySpan.classList.add("text-success");
      TextSimilaritySpan.textContent = e.text_similarity;
      TextSimilarity.append(TextSimilaritySpan);

      //------------------- FaceVerified -------------------------------
      let FaceVerified = document.createElement("h5");
      FaceVerified.classList.add("card-title d-inline");
      FaceVerified.textContent = "Face Verified : ";
      let FaceVerifiedSpan = document.createElement("span");
      FaceVerifiedSpan.classList.add("text-success");
      FaceVerifiedSpan.textContent = e.face_verified;
      FaceVerified.append(FaceVerifiedSpan);

      //------------------- Face Distance -------------------------------
      let FaceDistance = document.createElement("h5");
      FaceDistance.classList.add("card-title d-inline");
      FaceDistance.textContent = " Face Distance :";
      let FaceDistanceSpan = document.createElement("span");
      FaceDistanceSpan.classList.add("text-success");
      FaceDistanceSpan.textContent = e.face_distance;
      FaceDistance.append(FaceDistanceSpan);

      //------------------- Match Result -------------------------------
      let MatchResult = document.createElement("h5");
      MatchResult.classList.add("card-title d-inline");
      MatchResult.textContent = "Match Result :";
      let MatchResultSpan = document.createElement("span");
      MatchResultSpan.classList.add("text-success");
      MatchResultSpan.textContent = e.match_result;
      MatchResult.append(MatchResultSpan);

      //------------------- Contact Info -------------------------------
      let ContactInfo = document.createElement("h5");
      ContactInfo.classList.add("card-title d-inline");
      ContactInfo.textContent = "Contact Info : ";
      let ContactInfoSpan = document.createElement("span");
      ContactInfoSpan.classList.add("text-success");
      ContactInfoSpan.textContent = e.contact_info.found;
      ContactInfo.append(ContactInfoSpan);

      //------------------- Appinding -------------------------------
      createDivParent.append(createDivData);
      createDivData.append(TextSimilarity);
      createDivData.append(FaceVerified);
      createDivData.append(FaceDistance);
      createDivData.append(MatchResult);
      createDivData.append(ContactInfo);
    });
  }
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
                            <button type="button" class="btn btn-light btn-sm" id="btn-add-new">Add Another</button>
                            <button type="button" class="btn btn-outline-light btn-sm" id="btn-go-home">Check your lost items</button>
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
        $("#lost-phone-form")[0].reset();
        $("#preview").attr(
          "src",
          "images/id-card-illustration_23-2147829294.avif"
        );
        $(".error-msg").text("");
        toast.hide();
      });

    toastElement
      .querySelector("#btn-go-home")
      .addEventListener("click", function () {
        window.location.replace("Investigations.html");
      });
  }

  toastElement.addEventListener("hidden.bs.toast", function () {
    toastElement.remove();
  });
};
