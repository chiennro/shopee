let url = window.location.href;

if (url.includes("info")) {
  $("#info").addClass("active");
} else if (url.includes("order")) {
  $("#order").addClass("active");
} else {
  $("#favorite").addClass("active");
}

// Change Password
function checkEmpty(data) {
  data.forEach((item) => {
    if (item.val() === "") {
      item.css("border", "1px solid var(--error-color)");
      item[0].parentElement.querySelector(
        ".content-info-group span"
      ).innerText = "Thông tin này bắt buộc";
    } else {
      item.css("border", "1px solid #ddd");
    }
  });
}

async function saveChange() {
  $(".content-info-group span").text("");
  const currentPassword = $("#currentPassword");
  const newPassword = $("#newPassword");
  const confirmPassword = $("#confirmPassword");
  try {
    checkEmpty([currentPassword, newPassword, confirmPassword]);
    if (newPassword.val().length < 6) {
      newPassword[0].parentElement.querySelector(
        ".content-info-group span"
      ).innerText = "Mật khẩu này quá yếu";
      newPassword.css("border", "1px solid var(--error-color)");
    } else {
      if (newPassword.val() === confirmPassword.val()) {
        await $.ajax({
          type: "PUT",
          url: "/user/profile/change-password",
          data: {
            currentPassword: currentPassword.val(),
            newPassword: newPassword.val(),
          },
        });
        document.cookie =
          "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
      } else {
        confirmPassword[0].parentElement.querySelector(
          ".content-info-group span"
        ).innerText = "Mật khẩu phải được trùng khớp";
        newPassword.css("border", "1px solid var(--error-color)");
        confirmPassword.css("border", "1px solid var(--error-color)");
      }
    }
  } catch (error) {
    currentPassword[0].parentElement.querySelector(
      ".content-info-group span"
    ).innerText = error.responseJSON.message;
    currentPassword.css("border", "1px solid var(--error-color)");
  }
}

document.onkeydown = function (e) {
  if (e.code === "Enter") {
    saveChange();
  }
};

// Edit Info
function editName() {
  const username = $("#edit-username");
  username.css("border", "1px solid #ddd");
  $(".error-text").text("");
  $(".content-info-detail-name").css("display", "none");
  $(".error-edit").attr("style", "display : flex");
  username.on("blur", () => {
    if (username.val().length > 2 && username.val().length < 50) {
      $(".error-edit").css("display", "none");
      $(".content-info-detail-name").css("display", "flex");
      $(".content-info-detail-name p").text(username.val());
    } else {
      username.css("border", "1px solid var(--btn-color)");
      $(".error-text").text("Username phải có từ 2-50 kí tự");
    }
  });
}

async function changeInfo() {
  try {
    const username = $("#edit-username").val();
    const address = $("#address").val();
    const day = $("#day").val();
    const month = $("#month").val().slice(6, $("#month").val().length);
    const year = $("#year").val();
    const gender = $("#gender").val();
    if (username.length > 2 && username.length < 50) {
      await $.ajax({
        url: "/user/profile/edit",
        type: "PUT",
        data: {
          username: username,
          address: address,
          day: day,
          month: month,
          year: year,
          gender: gender,
        },
      });
      const form = $("form")[0];
      const formData = new FormData(form);
      await $.ajax({
        url: "/user/profile/upload",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
      });
      window.location.href = "/profile/info";
    } else {
      alert("Invalid Username");
    }
  } catch (error) {
    console.log(error);
  }
}

// * Remove Heart
async function removeHeart(codeID) {
  try {
    await $.ajax({
      type: "PUT",
      url: "/user/favorite",
      data: {
        codeID,
      },
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

//* Cancel Order
async function cancelOrder(orderID) {
  try {
    await $.ajax({
      type: "PUT",
      url: "/order/cancel/" + orderID,
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

//* Evaluate
$(".modal-rated-star-icon").on("click", function () {
  if ($(this).attr("class").includes("active-star")) {
    $(this).removeClass("active-star");
  } else {
    $(this).addClass("active-star");
  }
});

$(".modal-rated-text textarea").on("keyup", function () {
  if ($(this).val().trim().length > 100) {
    $(".modal-rated-text span").css("color", "var(--error-color)");
  } else {
    $(".modal-rated-text span").css("color", "#757575");
    $(".modal-rated-text span").text($(this).val().trim().length);
  }
});

function getDataToModal(codeID, productName, ele) {
  $(".modal-rated-header h5").text("Đánh giá cho " + productName);
  $(".modal-rated-text span").text("0");
  $(".modal-rated-text textarea").val("");
  $(".modal-rated-text span").css("color", "#757575");
  $(".modal-rated-error").css("display", "none");
  $(".modal-footer-post").attr("id", codeID);
  $(".modal-footer-post").attr("index", ele.getAttribute("index"));
}

$(".modal-footer-post").one("click", async function () {
  try {
    const countStar = $(".active-star").length;
    const comment = $(".modal-rated-text textarea").val().trim();
    const codeID = $(this).attr("id");
    const orderID = $(this).attr("order-id");
    if (countStar == 0) {
      $(".modal-rated-error").css("display", "block");
    } else if (comment.length <= 100) {
      await $.ajax({
        type: "POST",
        url: "/rated/creat",
        data: {
          orderID,
          codeID,
          i: $(this).attr("index"),
          star: countStar,
          content: comment,
        },
      });
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
});

//* Upload Preview Image
function importData() {
  document.getElementById("upload-avatar").click();
}

var fileToRead = document.getElementById("upload-avatar");

fileToRead.addEventListener(
  "change",
  function () {
    var files = fileToRead.files;
    if (files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        $("#avatar-edit").attr("src", fr.result);
      };
      fr.readAsDataURL(files[0]);
    }
  },
  false
);
