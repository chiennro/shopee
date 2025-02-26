pointerImg();
querychange();
// check query color & size URL từ page cart
function querychange() {
  if ($(".nhom-mau").attr("alt")) {
    for (let i = 0; i < $(".img-sp").length; i++) {
      if ($(`#mau-sp${i * 2}`).attr("alt") === $(".nhom-mau").attr("alt")) {
        $(`#mau-sp${i * 2}`).attr("class", "mau-chon");
        $(".ten-mau span").html($(".nhom-mau").attr("alt"));
        checksize($(`#mau-sp${i * 2}`).attr("alt"), $(".name-sp").attr("alt")); // check size
        $(".nhom-mau").attr("alt", "");
      }
    }
  }
  if ($(".nhom-size").attr("alt")) {
    for (let i = 0; i < $(".btn-size").length; i++) {
      if ($(`#size-sp${i * 2}`).attr("alt") === $(".nhom-size").attr("alt")) {
        $(`#size-sp${i * 2}`).attr({ class: "size-chon" });
        $(".ten-size span").html($(".nhom-size").attr("alt"));

        $(".nhom-size").attr("alt", "");
      }
    }
  }
}

//* hiệu ứng mouse chuột qua smallImg
function pointerImg() {
  $(".smallImg").on("mouseover", function () {
    const link = $(this).attr("src");
    const id = $(this).attr("id");
    $(".bigImg").attr("src", link);
    $(".bigImg").attr("id", "myimage" + id);
    $(this).css({ border: "1px solid var(--btn-color)" });
  });
  $(".smallImg").on("mouseout", function imgBigOff() {
    $(this).css({ border: "none" });
  });
}

//* next - back div link ảnh sản phẩm
$(".img-line .back").css({ cursor: "pointer" });
$(".img-line .next").css({ cursor: "pointer" });
function next(len) {
  max = len * 50 - 100;
  let right = $(".img-next-slick img").attr("style");
  if (!right) {
    right = 0;
  } else {
    let value = right.split(" ")[1].split("");
    let length = value.length;
    value.splice(length - 3, 3);
    right = value.join("");
  }
  if (max > right * 1) {
    // $('.img-next-slick img').css({ right: ` ${right*1 + 50}px ` })
    $(".img-next-slick img").css({ right: ` ${right}px ` });
    $(".img-next-slick img").animate(
      {
        right: "+=200px",
      },
      500
    );
    $(".img-line .back").css({ cursor: "pointer" });
  } else {
    $(".img-line .next").css({ cursor: "not-allowed" });
  }
}

function back() {
  let right = $(".img-next-slick img").attr("style");
  // console.log(right);
  if (!right) {
    right = 0;
  } else {
    let value = right.split(" ")[1].split("");
    let length = value.length;
    value.splice(length - 3, 3);
    right = value.join("");
  }
  if (right > 0) {
    // $('.img-next-slick img').css({ right: ` ${right*1 - 50}px ` })
    $(".img-next-slick img").css({ right: ` ${right}px ` });
    $(".img-next-slick img").animate(
      {
        right: "-=200px",
      },
      500
    );
    $(".img-line .next").css({ cursor: "pointer" });
  } else {
    $(".img-line .back").css({ cursor: "not-allowed" });
  }
}

// + - số lượng sản phẩm
function down() {
  let number = $("#number-sp").val() * 1;
  if (number > 1) {
    $("#number-sp").val(number - 1);
    $(".toast-error").text("");
  } else {
    $(".toast-error").text("Số lượng phải có tối thiểu 1 sản phẩm");
  }
}

function up() {
  let number = $("#number-sp").val() * 1;
  if (number < 10) {
    $("#number-sp").val(number + 1);
    $(".toast-error").text("");
  } else {
    $(".toast-error").text("Số lượng mua tối đa là 10 sản phẩm");
  }
}

// hiệu ứng mouse chuột qua hình ảnh chọn màu
$(".img-sp img").on("mouseover", function () {
  const src = $(this).attr("src");
  const id = $(this).attr("id");
  $(".bigImg").attr("src", src);
  $(".bigImg").attr("id", "myimage" + id);
});

function renderSize() {
  $(".btn-sp button").on("click", function () {
    const size = $(this).text();
    $(".select-size span").text(size);
    $(".btn-sp button").removeClass("active");
    $(this).addClass("active");
    $(".toast-error").text("");
  });
}

renderSize();

let processAnimate = {
  showAgain(imgRemain) {
    for (let i = 0; i < imgRemain.length; i++) {
      imgRemain
        .eq(i)
        .animate({ width: "show", margin: "8px 12px 0 0", opacity: "1" }, 500);
    }
  },
  hideNotActive(imgNotActive) {
    for (let i = 0; i < imgNotActive.length; i++) {
      imgNotActive
        .eq(i)
        .animate({ width: "hide", margin: "0", opacity: "0" }, 500);
    }
  },
};

$(".image-mau").on("click", function () {
  $(".toast-error").text("");
  if ($(this).attr("class").includes("active")) {
    processAnimate.showAgain($(".image-mau:not(.active)"));
    $(".select-color span").text("Vui lòng chọn");
    $(".select-size span").text("Vui lòng chọn");
    $(this).removeClass("active");
    $(".size-sp").html("");
    $(".select-qty p").text("");
  } else {
    $(".size-sp").html("");
    const color = $(this).attr("data-color");
    const quantity = $(this).attr("quantity");
    $(".select-color span").text(color);
    $(".image-mau.active").removeClass("active");
    $(this).addClass("active");
    processAnimate.hideNotActive($(".image-mau:not(.active)"));
    $(".select-size span").text("Vui lòng chọn");
    $(".select-qty p").text(`Còn ${quantity} sản phẩm`);
    if ($(this).attr("data-size") != "") {
      const listSize = $(this).attr("data-size").split(",");
      listSize.forEach((size) => {
        const htmls = `
          <div class="btn-sp">
            <button class="btn-size " id="" alt="">${size}</button>
          </div>
        `;
        $(".size-sp").append(htmls);
      });
      renderSize();
    }
  }
});

// đoi link ảnh smallimg khi chọn color
async function change(mau, idcode) {
  try {
    const res = await $.ajax({
      url: "/product/change/mau",
      type: "GET",
      data: { mau: mau, idcode: idcode },
    });
    // console.log(117,res);
    $(".block-left").html(res);
    pointerImg(); // zoom ảnh lên bigImg
    zoombigImg(); // zoom in ảnh từ bigImg
  } catch (error) {
    console.log(error);
  }
}

//* Zoom Image
zoombigImg();
// imageZoom("myimage", "myresult");
//zoom ảnh bigImg
function zoombigImg() {
  $(".img1 img").on("mouseover", function () {
    $(".img-zoom-result").show();
    const id = $(".bigImg").attr("id");
    imageZoom(`${id}`, "myresult");
  });
  $(".img1").on("mouseleave", function () {
    $(".img-zoom-result").hide();
    $(".img-zoom-lens").remove(); // xóa ống kính cũ
  });
}
$(".img-zoom-result").hide();

function imageZoom(imgID, resultID) {
  console.log(109, imgID, resultID);
  $(".img-zoom-lens").remove(); // xóa ống kính cũ
  var img, lens, result, cx, cy;
  img = document.getElementById(imgID);
  result = document.getElementById(resultID);
  /*tạo ống kính:*/
  lens = document.createElement("DIV");
  lens.setAttribute("class", "img-zoom-lens");
  /*chèn ống kính:*/
  img.parentElement.insertBefore(lens, img);
  /*tính toán tỷ lệ giữa kết quả DIV và thấu kính*/
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /*đặt thuộc tính nền cho kết quả DIV:*/
  result.style.backgroundImage = "url('" + img.src + "')";
  result.style.backgroundSize = img.width * cx + "px " + img.height * cy + "px";
  /*thực thi một chức năng khi ai đó di chuyển con trỏ qua hình ảnh hoặc ống kính:*/
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);
  /*và cả đối với màn hình cảm ứng:*/
  lens.addEventListener("touchmove", moveLens);
  img.addEventListener("touchmove", moveLens);
  function moveLens(e) {
    var pos, x, y;
    /*ngăn chặn bất kỳ hành động nào khác có thể xảy ra khi di chuyển qua hình ảnh:*/
    e.preventDefault();
    /*lấy vị trí x và y của con trỏ:*/
    pos = getCursorPos(e);
    /*tính vị trí của thấu kính*/
    x = pos.x - lens.offsetWidth / 2;
    y = pos.y - lens.offsetHeight / 2;
    /*ngăn không cho ống kính được định vị bên ngoài hình ảnh:*/
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }
    /*đặt vị trí của thấu kính::*/
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /*hiển thị những gì ống kính "nhìn thấy":*/
    result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
  }
  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*tính toán tọa độ x và y của con trỏ, liên quan đến hình ảnh*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*xem xét bất kỳ cuộn trang nào:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}

if ($(".select-name").attr("class").includes("select-color")) {
  console.log(123);
} else {
  console.log(456);
}

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

//* Add Cart
async function addCart(productID) {
  if ($(".image-mau.active").attr("id") != undefined) {
    productID = $(".image-mau.active").attr("id");
  }
  const size = $(".select-size span").text().trim();
  const quantity = $("#number-sp").val() * 1;
  try {
    if (document.cookie) {
      if ($(".select-qty p").text().length > 0 && size != "Vui lòng chọn") {
        await $.ajax({
          type: "POST",
          url: "/cart/create",
          data: {
            productID,
            size,
            quantity,
          },
        });
        showToast();
      } else {
        $(".toast-error").text("Vui lòng chọn đầy đủ thông tin sản phẩm");
      }
    } else {
      window.location.href = "/login";
    }
  } catch (error) {
    console.log(error);
  }
}

// * Buy now
async function buyNow(productID) {
  if ($(".image-mau.active").attr("id") != undefined) {
    productID = $(".image-mau.active").attr("id");
  }
  const size = $(".select-size span").text().trim();
  const quantity = $("#number-sp").val() * 1;
  try {
    if (document.cookie) {
      if ($(".select-qty p").text().length > 0 && size != "Vui lòng chọn") {
        await $.ajax({
          type: "POST",
          url: "/cart/create",
          data: {
            productID,
            size,
            quantity,
            checked: true,
          },
        });
        window.location.href = "/cart";
      } else {
        $(".toast-error").text("Vui lòng chọn đầy đủ thông tin sản phẩm");
      }
    } else {
      window.location.href = "/login";
    }
  } catch (error) {
    console.log(error);
  }
}

// * Show Heart
async function showHeart(codeID) {
  try {
    const styleHeart = $("#" + codeID).attr("style");
    if (document.cookie) {
      if (styleHeart == "" || styleHeart == undefined) {
        $("#" + codeID).attr("style", "color : red");
      } else {
        $("#" + codeID).attr("style", "");
      }
      await $.ajax({
        url: "/user/favorite",
        type: "PUT",
        data: {
          codeID,
        },
      });
    } else {
      window.location.href = "/login";
    }
  } catch (error) {
    console.log(error);
  }
}

// * Change rate of user
$(".modal-rated-text textarea").on("keyup", function () {
  if ($(this).val().trim().length > 100) {
    $(".modal-rated-text span").css("color", "var(--error-color)");
  } else {
    $(".modal-rated-text span").css("color", "#757575");
    $(".modal-rated-text span").text($(this).val().trim().length);
  }
});

function getDataToModal(star, comment, rateID) {
  $(".modal-rated-star").html("");
  for (let i = 0; i < 5; i++) {
    const htmlStar = `
    <span class="modal-rated-star-icon ${i < star * 1 ? "active-star" : ""}">
      <i class="fas fa-star"></i>
    </span>
    `;
    $(".modal-rated-star").append(htmlStar);
  }
  $(".modal-rated-star-icon").on("click", function () {
    if ($(this).attr("class").includes("active-star")) {
      $(this).removeClass("active-star");
    } else {
      $(this).addClass("active-star");
    }
  });
  $(".modal-rated-error").css("display", "none");
  $(".modal-rated-text textarea").val(comment);
  $(".modal-rated-text p span").text(comment.length);
  $(".modal-footer-post").attr("id", rateID);
}

async function editRate(ele, codeID) {
  try {
    const star = $(".active-star").length;
    if (star == 0) {
      $(".modal-rated-error").css("display", "block");
    } else {
      await $.ajax({
        type: "PUT",
        url: "/rated/" + ele.getAttribute("id"),
        data: {
          codeID,
          content: $(".modal-rated-text textarea").val(),
          star,
        },
      });
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}
