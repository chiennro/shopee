checkboxCount();
sumCart();
handleAll();

$(".down").on("click", function () {
  const currentQty = $(this)
    .parent()[0]
    .querySelector(".quantity-product").value;
  if (currentQty > 1) {
    setTimeout(() => {
      $(this).parent()[0].querySelector(".quantity-product").value =
        currentQty - 1;
      sumCart();
      editQuantity(
        $(this).parent()[0].querySelector(".quantity-product").value,
        $(this).attr("data-index")
      );
    }, 500);
  }
});

$(".up").on("click", function () {
  const currentQty = $(this)
    .parent()[0]
    .querySelector(".quantity-product").value;
  if (currentQty < 10) {
    setTimeout(() => {
      $(this).parent()[0].querySelector(".quantity-product").value =
        currentQty * 1 + 1;
      sumCart();
      editQuantity(
        $(this).parent()[0].querySelector(".quantity-product").value,
        $(this).attr("data-index")
      );
    }, 500);
  }
});

async function editQuantity(num, i) {
  try {
    await $.ajax({
      type: "POST",
      url: "/cart/quantity",
      data: {
        i,
        quantity: num * 1,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

$(".cart-item-checkbox").on("click", async function () {
  checkboxCount();
  sumCart();
  handleAll();
  const quantity = $(this)
    .parent()
    .parent()[0]
    .querySelector(".quantity-product").value;
  try {
    await $.ajax({
      url: "/cart/checkbox",
      type: "PUT",
      data: {
        i: $(this).attr("data-index"),
        checked: $(this).prop("checked"),
      },
    });
  } catch (error) {
    console.log(error);
  }
});

function checkboxCount() {
  let count = $(".cart-item-checkbox:checked").length;
  $(".checkout-summary-label span").text(count);
  $(".order-group span").text(count);
}

function sumCart() {
  let checked = $(".cart-item-checkbox:checked");
  if (checked.length > 0) {
    var total = 0;
    for (let i = 0; i < checked.length; i++) {
      let checkQuantity = checked
        .parent()
        .parent()
        [i].querySelector(".quantity-product").value;
      // console.log(typeof (checked.eq(i).attr("data-price") * checkQuantity));
      total += checked.eq(i).attr("data-price") * checkQuantity;
    }
    $(".checkout-value").text(total.toLocaleString("vi") + " ₫");
    $(".checkout-order-value span").text(total.toLocaleString("vi") + " ₫");
    $(".order-group").css({ "pointer-events": "auto", opacity: "1" });
  } else {
    $(".checkout-value").text("0 ₫");
    $(".checkout-order-value span").text("0 ₫");
    $(".order-group").css({ "pointer-events": "none", opacity: "0.5" });
  }
}

function handleAll() {
  if (
    $(".cart-item-checkbox").length == $(".cart-item-checkbox:checked").length
  ) {
    $(".checkall").prop("checked", true);
  } else {
    $(".checkall").prop("checked", false);
  }
}

async function checkboxAll() {
  try {
    if ($(".checkall").prop("checked")) {
      for (let i = 0; i < $(".cart-item-checkbox").length; i++) {
        $(".cart-item-checkbox").eq(i).prop("checked", true);
      }
    } else {
      for (let i = 0; i < $(".cart-item-checkbox").length; i++) {
        $(".cart-item-checkbox").eq(i).prop("checked", false);
      }
    }
    checkboxCount();
    sumCart();
    await $.ajax({
      type: "PUT",
      url: "/cart/checkboxAll?checked=" + $(".checkall").prop("checked"),
    });
  } catch (error) {
    console.log(error);
  }
}

async function xoa(index) {
  try {
    await $.ajax({
      type: "DELETE",
      url: "/cart/remove?i=" + index,
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

async function xoaAll() {
  try {
    await $.ajax({
      type: "DELETE",
      url: "/cart/removeAll",
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}
