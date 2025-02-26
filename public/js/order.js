findaddress();

//* Toast
function showToast() {
  var toastTrigger = document.getElementById("liveToastBtn");
  var toastLiveExample = document.getElementById("liveToast");
  if (toastTrigger) {
    var toast = new bootstrap.Toast(toastLiveExample);
    toastLiveExample.setAttribute("style", "animation: showToast linear 0.2s;");
    toast.show();
  }
}

function toastSuccess() {
  $(".toast").addClass("toast-success");
  $(".toast").removeClass("toast-error");
  $(".toast-logo").html('<i class="far fa-check-circle"></i>');
  $(".toast h3").text("Lưu thông tin thành công");
}

function toastError(message) {
  $(".toast").addClass("toast-error");
  $(".toast").removeClass("toast-success");
  $(".toast-logo").html('<i class="far fa-times-circle"></i>');
  $(".toast h3").text(message);
}

// * Find Address
async function findaddress() {
  $.ajax({
    url: "https://provinces.open-api.vn/api/?depth=1",
    type: "GET",
  })
    .then(function (data) {
      let datatinh = $(".adress_tinh").html();
      for (let i = 0; i < data.length; i++) {
        datatinh += `<option value='${data[i].name}'> ${data[i].name} </option>`;
      }
      $(".adress_tinh").html(datatinh);
    })
    .catch(function (err) {
      console.log(err);
    });
}

async function chonTinh(obj) {
  try {
    if ($(".adress_tinh").val() !== "") {
      $(".tinh span").html("");
      $(".adress_tinh").css("border", "1px solid #ddd");
    }
    if ($(".adress_tinh7").val() !== "") {
      $(".tinh span").html("");
      $(".adress_tinh7").css("border", "1px solid #ddd");
    }
    // Lấy danh sách các options
    var options = obj.children;
    // Biến lưu trữ các chuyên mục đa chọn
    var html = "";
    // lặp qua từng option và kiểm tra thuộc tính selected
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        html += options[i].value;
        $(".adress_tinh").attr("alt", html);
        renderTinhThanh();
        renderpointer();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function renderTinhThanh() {
  if ($(".adress_tinh").attr("alt") !== "") {
    $.ajax({
      url: "https://provinces.open-api.vn/api/?depth=2",
      type: "GET",
    })
      .then(function (data) {
        const data1 = data.find(function (a) {
          return a.name === $(".adress_tinh").attr("alt");
        });
        let dataquan = "";
        for (let i = 0; i < data1.districts.length; i++) {
          dataquan += `<option value='${data1.districts[i].name}_${data1.districts[i].code}'> ${data1.districts[i].name} </option>`;
        }
        $(".adress_quan").html(dataquan);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

async function chonQuan(obj) {
  try {
    if ($(".adress_quan").val() !== "") {
      $(".quan span").html("");
      $(".adress_quan").css("border", "1px solid #ddd");
    }
    if ($(".adress_quan7").val() !== "") {
      $(".quan span").html("");
      $(".adress_quan7").css("border", "1px solid #ddd");
    }
    // Lấy danh sách các options
    var options = obj.children;
    // Biến lưu trữ các chuyên mục đa chọn
    var html = "";
    // lặp qua từng option và kiểm tra thuộc tính selected
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        html += options[i].value;
        $(".adress_quan").attr("alt", html);
        renderPhuongXa($(".adress_quan").attr("alt").split("_")[1]); // lấy code Phường để api data xã
        renderpointer();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function renderPhuongXa(code) {
  if ($(".adress_quan").attr("alt") !== "") {
    $.ajax({
      url: `https://provinces.open-api.vn/api/d/${code}?depth=2`,
      type: "GET",
    })
      .then(function (data) {
        let dataphuong = "";
        for (let i = 0; i < data.wards.length; i++) {
          dataphuong += `<option value='${data.wards[i].name}'> ${data.wards[i].name} </option>`;
        }
        $(".adress_phuong").html(dataphuong);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

async function chonPhuong(obj) {
  try {
    var options = obj.children;
    var html = "";
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        html += options[i].value;
        $(".adress_phuong").attr("alt", html);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function renderpointer() {
  if ($(".adress_tinh").attr("alt") !== "") {
    $(".adress_quan").removeClass("disable");
    $(".adress_quan").addClass("enabled");
  }
  if ($(".adress_quan").attr("alt") !== "") {
    $(".adress_phuong").removeClass("disable");
    $(".adress_phuong").addClass("enabled");
  }
}

function nharieng() {
  if ($(".mod-address-tag-icon-2").css("color") !== "rgb(255, 87, 59)") {
    $(".mod-address-tag-icon-2").css("color", "rgb(255, 87, 59)");
    $(".mod-address-tag-icon-1").css("color", "#999");
    $(".vp").css("color", "#999");
    $(".nr").css("color", "rgb(255, 87, 59)");
  } else {
    $(".mod-address-tag-icon-2").css("color", "#999");
    $(".nr").css("color", "#999");
  }
}

function vanphong() {
  if ($(".mod-address-tag-icon-1").css("color") !== "rgb(0, 151, 186)") {
    $(".mod-address-tag-icon-1").css("color", "rgb(0, 151, 186)");
    $(".mod-address-tag-icon-2").css("color", "#999");
    $(".nr").css("color", "#999");
    $(".vp").css("color", "rgb(0, 151, 186)");
  } else {
    $(".mod-address-tag-icon-1").css("color", "#999");
    $(".vp").css("color", "#999");
  }
}

function hoten() {
  if ($(".hoten").val() !== "") {
    $(".mod-input-name span").html("");
    $(".hoten").css("border", "1px solid #ddd");
  }
  if ($(".hoten7").val() !== "") {
    $(".mod-input-name span").html("");
    $(".hoten7").css("border", "1px solid #ddd");
  }
}

function phone() {
  if ($(".phone").val() !== "") {
    $(".mod-input-phone span").html("");
    $(".phone").css("border", "1px solid #ddd");
  }
  if ($(".phone7").val() !== "") {
    $(".mod-input-phone span").html("");
    $(".phone7").css("border", "1px solid #ddd");
  }
}

function diachi() {
  if ($(".diachi").val() !== "") {
    $(".mod-input-adress span").html("");
    $(".diachi").css("border", "1px solid #ddd");
  }
  if ($(".diachi7").val() !== "") {
    $(".mod-input-adress span").html("");
    $(".diachi7").css("border", "1px solid #ddd");
  }
}

var paymentMethod = "";

$(".card-container").on("click", function () {
  const cardContainer = $(".card-container");
  for (var i = 0; i < cardContainer.length; i++) {
    $("#" + $(cardContainer[i])[0].id + " .checked-icon").css(
      "visibility",
      "hidden"
    );
    $(cardContainer[i]).css("border", "1px solid rgb(234, 234, 234)");
  }
  $(this).css("border", "1px solid #1a9cb7");
  $("#" + $(this)[0].id + " .checked-icon").css("visibility", "visible");
  paymentMethod = $(this)[0].id;
});

// async function sendCode(code) {
//   try {
//     const htmlSuccess = `
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       height="20"
//       fill="currentColor"
//       class="bi bi-check-circle"
//       viewBox="0 0 16 16"
//     >
//       <path
//         style="fill: var(--success-color)"
//         d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
//       />
//       <path
//         style="fill: var(--success-color)"
//         d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
//       />
//     </svg>
//     `;
//     $(".summary-section-code-send").html(htmlSuccess);
//     await $.ajax({
//       type: "POST",
//       url: "/order/sendCode",
//       data: {
//         code,
//         name: $(".hoten").val(),
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

async function saveInfo() {
  let fullname = $(".hoten").val(),
    phone = $(".phone").val(),
    address = `${$(".diachi").val()}, ${$(".adress_phuong").val()}, ${$(
      ".adress_quan"
    ).val()}, ${$(".adress_tinh").val()}`;
  if (
    fullname == "" ||
    phone == "" ||
    $(".diachi").val() == "" ||
    $(".adress_phuong").val() == "" ||
    $(".adress_quan").val() == "" ||
    $(".adress_tinh").val() == ""
  ) {
    toastError("Lưu thất bại, vui lòng điền đầy đủ thông tin giao hàng!");
    $(".dat-hang").addClass("hide-btn");
  } else if (
    $(".mod-address-tag-icon-1").css("color") == "rgb(153, 153, 153)" &&
    $(".mod-address-tag-icon-2").css("color") == "rgb(153, 153, 153)"
  ) {
    toastError("Vui lòng chọn tên cho địa chỉ");
    $(".dat-hang").addClass("hide-btn");
  } else {
    if (isVietnamesePhoneNumber(phone)) {
      toastSuccess();
      $(".mod-guest-register").addClass("hide-btn");
      $(".summary-section-code-send button").removeClass("hide-btn");
      $(".dat-hang").removeClass("hide-btn");
      const code = Math.random().toFixed(6) * 10 ** 6;
      const codeConfirm = code >= 10 ** 5 ? code : code + 10 ** 5;
      // $(".summary-section-code-send button").on("click", async () => {
      //   sendCode(codeConfirm);
      // });
      $(".dat-hang").on("click", async function () {
        const type =
          $(".vp").css("color") !== "rgb(153, 153, 153)"
            ? $(".vp").text()
            : $(".nr").text();
        try {
          // $(".summary-section-code span").text("");
          await $.ajax({
            type: "POST",
            url: "/order/create",
            data: {
              name: fullname,
              phone,
              address,
              total: $(".bill").attr("data-total"),
              type,
              paymentMethod
            },
          });
          if (paymentMethod === "payment-online") {
            const response = await $.ajax({
              type: "POST",
              url: "/order/create-payment",
              data: {
                name: fullname,
                phone,
                address,
                total: $(".bill").attr("data-total"),
                type,
                returnUrl: `/order/${$(this).attr("id")}?result=success`,
              },
            });
            window.location.href = response;
          } else {
            window.location.href = `/order/${$(this).attr(
              "id"
            )}?result=success`;
          }
        } catch (error) {
          alert(error.responseJSON.mess);
        }
      });
    } else {
      toastError("Số điện thoại này không hợp lệ");
      $(".dat-hang").addClass("hide-btn");
    }
  }
  showToast();
}

function isVietnamesePhoneNumber(number) {
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(number);
}

// xóa
async function xoa(price, i, ele) {
  const orderItem = $(ele).parent().parent().parent();
  const countProduct = $(".checkout-summary-label span").text();
  const currentPrice = $(".bill").attr("data-total");
  const nextPrice = currentPrice * 1 - price * 1;
  try {
    if (countProduct > 1) {
      orderItem.animate(
        { height: "hide", padding: "0", margin: "0", opacity: "0" },
        300
      );
      $(".checkout-summary-label span").text(countProduct * 1 - 1);
      $(".bill").attr("data-total", nextPrice);
      $(".bill").text(nextPrice.toLocaleString("vi"));
      $(".bill-total").text((nextPrice + 20000).toLocaleString("vi"));
      await $.ajax({
        url: "/order/xoa?index=" + i,
        type: "PUT",
      });
    } else {
      alert("Bạn không thể bỏ sản phẩm này vì đây là sản phẩm cuối cùng");
    }
  } catch (error) {
    console.log(error);
  }
}
