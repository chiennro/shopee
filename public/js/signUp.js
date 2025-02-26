function checkEmpty(data) {
  data.forEach((item) => {
    if (item.val() === "") {
      item.css("border", "1px solid var(--error-color)");
      item[0].parentElement.querySelector(".form-message").innerText =
        "Thông tin này bắt buộc";
    } else {
      item.css("border", "1px solid #ddd");
    }
  });
}

async function signUp() {
  $(".form-message").text("");
  const email = $("#email");
  const password = $("#password");
  const confirmPassword = $("#confirmPassword");
  const username = $("#username");
  try {
    checkEmpty([email, password, confirmPassword, username]);
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email.val().trim())) {
      var numbers = /[0-9]/g;
      var upperCaseLetters = /[A-Z]/g;
      var lowerCaseLetters = /[a-z]/g;
      if (
        password.val().length > 6 &&
        password[0].value.match(numbers) &&
        (password[0].value.match(upperCaseLetters) ||
          password[0].value.match(lowerCaseLetters))
      ) {
        if (username.val().length > 3 && username.val().length <= 50) {
          await $.ajax({
            type: "POST",
            url: "user/register",
            data: {
              email: email.val(),
              password: password.val(),
              confirmPassword: confirmPassword.val(),
              username: username.val(),
            },
          });
          window.location.href = "/login";
        } else {
          username[0].parentElement.querySelector(".form-message").innerText =
            "Độ dài phải từ 4-50 kí tự";
          username.css("border", "1px solid var(--error-color)");
        }
      } else if (password.val() !== confirmPassword.val()) {
        confirmPassword[0].parentElement.querySelector(
          ".form-message"
        ).innerText = "Mật khẩu phải được trùng khớp";
        confirmPassword.css("border", "1px solid var(--error-color)");
      } else {
        password[0].parentElement.querySelector(".form-message").innerText =
          "Mật khẩu này quá yếu";
        password.css("border", "1px solid var(--error-color)");
      }
    } else if (email.val().trim().length > 0) {
      email[0].parentElement.querySelector(".form-message").innerText =
        "Email này không hợp lệ";
      email.css("border", "1px solid var(--error-color)");
    }
  } catch (error) {
    email[0].parentElement.querySelector(".form-message").innerText =
      error.responseJSON.message;
    email.css("border", "1px solid var(--error-color)");
  }
}

document.onkeydown = function (e) {
  if (e.code === "Enter") {
    signUp();
  }
};
