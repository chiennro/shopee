let url = window.location.href;

$("#color").css("display", "block");
if (url.includes("color")) {
  var color = url.split("color=")[1].includes("&")
    ? url.split("color=")[1].split("&")[0]
    : url.split("color=")[1];
  $(".khoibentrai-group-color input").prop("checked", true);
  const html = `
    <div class="khoibenphai-price-item">
      Màu sắc : ${$(".khoibentrai-group-color label").text()}
      <i class="fas fa-times" onclick="removeColor()"></i>
    </div>
    `;
  $(".khoibenphai-price").append(html);
} else if ($(".khoibentrai-group-color span").text() == "") {
  $("#color").css("display", "none");
}

function removeColor() {
  let newUrl = url.replace("&color=" + color, "");
  window.location.href = newUrl;
}

function checkboxColor(element, color) {
  if (element.checked) {
    window.location.href =
      url.replace(
        "page=" + $(".khoibentrai-group-rate").eq(0).attr("page"),
        "page=1"
      ) +
      "&color=" +
      color;
  } else {
    removeColor();
  }
}

if (url.includes("rate")) {
  var rate = url.split("rate=")[1].includes("&")
    ? url.split("rate=")[1].split("&")[0]
    : url.split("rate=")[1];
  const html = `
    <div class="khoibenphai-price-item">
      Đánh giá : ${rate} 
      <i class="fas fa-times" onclick="removeRate()"></i>
    </div>
    `;
  $(".khoibenphai-price").append(html);
}

for (let i = 0; i < $(".khoibentrai-group-rate").length; i++) {
  $(".khoibentrai-group-rate")
    .eq(i)
    .on("click", () => {
      let star = Math.abs(i - 5);
      if (url.includes("rate")) {
        let newUrl = url.replace("rate=" + rate, "rate=" + star);
        window.location.href = newUrl;
      } else {
        window.location.href =
          url.replace(
            "page=" + $(".khoibentrai-group-rate").eq(0).attr("page"),
            "page=1"
          ) +
          "&rate=" +
          star;
      }
    });
}

if (url.includes("pricemin")) {
  var pricemin = url.split("pricemin=")[1].split("&")[0];
  var pricemax = url.split("pricemax=")[1].includes("&")
    ? url.split("pricemax=")[1].split("&")[0]
    : url.split("pricemax=")[1];
  const html = `
  <div class="khoibenphai-price-item">
    Giá : ${pricemin}-${pricemax}
    <i class="fas fa-times" onclick="removePrice()"></i>
  </div>
  `;
  $(".khoibenphai-price").append(html);
}

if (!url.split("sort=")[1].includes("&")) {
  $(".khoibenphai-price").css("display", "none");
}

if ($("#giatoithieu").val().length > 0 || $("#giatoida").val().length > 0) {
  $(".khoibentrai-group-price-btn").addClass("event-click");
}

// * Reset filter
const html = `<span class="khoibenphai-remove-all">Xóa hết</span>`;
$(".khoibenphai-price").append(html);

$(".khoibenphai-remove-all").on("click", () => {
  const sortBy = url.split("sort=")[1].split("&")[0];
  let newUrl = url.replace(url.split(sortBy)[1], "");
  window.location.href = newUrl;
});

// * Check empty
function checkEmpty() {
  if ($("#giatoithieu").val() === "" && $("#giatoida").val() === "") {
    $(".khoibentrai-group-price-btn").removeClass("event-click");
  } else {
    $(".khoibentrai-group-price-btn").addClass("event-click");
  }
}

$("#giatoithieu").on("keyup", () => {
  checkEmpty();
});
$("#giatoida").on("keyup", () => {
  checkEmpty();
});

// * Pagination
function changePage(page, pagenow) {
  let newUrl = url.replace("page=" + pagenow, "page=" + page);
  window.location.href = newUrl;
}

function pagePre(page) {
  let newUrl = url.replace("page=" + page, "page=" + (page * 1 - 1));
  window.location.href = newUrl;
}

function pageNext(page) {
  let newUrl = url.replace("page=" + page, "page=" + (page * 1 + 1));
  window.location.href = newUrl;
}

// * Search by price
function timtheogia(page) {
  let minprice = $("#giatoithieu").val();
  let maxprice = $("#giatoida").val();
  if (url.includes("pricemin")) {
    let newUrl = url
      .replace("pricemin=" + pricemin, "pricemin=" + minprice)
      .replace("pricemax=" + pricemax, "pricemax=" + maxprice);
    window.location.href = newUrl;
  } else {
    window.location.href =
      url.replace("page=" + page, "page=1") +
      `&pricemin=${minprice}&pricemax=${maxprice}`;
  }
}

// for (let i = 0; i < array.length; i++) {
//   const element = array[i];
// }

// function sizeSS(url, size) {
//   window.location.href = `${url}&size=${size}`;
// }
// function themMau(color) {
//   let arrduochienthi = [];
//   arrduochienthi.push(`${color}`);
// }
// function xoamaudo(color) {
//   if (color == $("#color")) {
//     this.html("");
//   }
// }

// for (let index = 0; index < array.length; index++) {
//   const element = array[index];
// }

// * Sort by
let sortBy = url.split("sort=")[1];

function sortByPrice(page) {
  const sort = $("#sort").val();
  if (url.split("sort=")[1].includes("&")) {
    window.location.href = url
      .replace("page=" + page, "page=1")
      .replace(url.split("sort=")[1].split("&")[0], sort);
  } else {
    window.location.href = url
      .replace("page=" + page, "page=1")
      .replace(sortBy, sort);
  }
}

if (sortBy.includes("&")) {
  $("#sort").val(sortBy.split("&")[0]);
} else {
  $("#sort").val(sortBy);
}

function removePrice() {
  let newUrl = url.replace(`&pricemin=${pricemin}&pricemax=${pricemax}`, "");
  window.location.href = newUrl;
}

function removeRate() {
  let newUrl = url.replace(`&rate=${rate}`, "");
  window.location.href = newUrl;
}
