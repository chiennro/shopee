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

async function signIn() {
  $(".form-message").text("");
  const email = $("#email");
  const password = $("#password");
  try {
    checkEmpty([email, password]);
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email.val().trim())) {
      const res = await $.ajax({
        type: "POST",
        url: "user/login",
        data: {
          email: email.val(),
          password: password.val(),
        },
      });
      window.location.href = "/";
    } else if (email.val().trim().length > 0) {
      email[0].parentElement.querySelector(".form-message").innerText =
        "Email này không hợp lệ";
      email.css("border", "1px solid var(--error-color)");
    }
  } catch (error) {
    console.log(error);
    password[0].parentElement.querySelector(".form-message").innerText =
      error.responseJSON.message;
    email.css("border", "1px solid var(--error-color)");
    password.css("border", "1px solid var(--error-color)");
  }
}

document.onkeydown = (e) => {
  if (e.code === "Enter") {
    signIn();
  }
};
