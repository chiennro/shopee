var idupdate = "";

function importData() {
  document.getElementById("clickavatar").click();
}

var fileToRead = document.getElementById("clickavatar");

fileToRead.addEventListener(
  "change",
  function () {
    var files = fileToRead.files;
    if (files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        document.getElementById("change").src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
  },
  false
);

function importimg() {
  document.getElementById("clickimg").click();
}

var fileToRea = document.getElementById("clickimg");

fileToRea.addEventListener(
  "change",
  function () {
    var files = fileToRea.files;
    if (files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        document.getElementById("changeimg").src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
  },
  false
);

async function but(page) {
  const res = await $.ajax({
    url: `/category/get?page=${page}&limit=10`,
    type: "GET",
  });
  $(".category").html("");
  $(".category").html(res);
}

async function addCategory() {
  try {
    const name = $("#name").val();
    const thumbnail = $("#clickavatar").val();
    console.log(name);
    if (name == "") {
      $(".note1").html("Vui lòng điền tên phân loại !");
    }
    if (thumbnail == "") {
      $(".note2").html("Vui lòng nhận phải ảnh phân loại !");
    } else {
      const form = $("form")[0];
      const formData = new FormData(form);
      const res = await $.ajax({
        url: "/category/add",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
      });
      window.location.reload();
    }
  } catch (error) {
    alert(`Thư mục đã có ${name}`);
  }
}

async function update(value) {
  const { _id, name, thumbnail } = JSON.parse(value);
  try {
    console.log(name, thumbnail);
    $(`#nameid`).val(name);
    $("#changeimg").attr("src", thumbnail);
    idupdate = _id;
  } catch (error) {
    console.log(error);
  }
}

var current = "";

async function but(page, total) {
  current = page;
  const res = await $.ajax({
    url: `/category/get?page=${page}&limit=10`,
    type: "GET",
  });
  $(".category").html("");
  $(".category").html(res);
  console.log(140, page, total);
  const pagea = String(page);
  if (page === total) {
    $(".next").attr("disabled", true);
    $(".next").css({ opacity: "0.5" });
  }
  if (pagea === total) {
    $(".next").attr("disabled", true);
    $(".next").css({ opacity: "0.5" });
  } else {
    $(".next").attr("disabled", false);
    $(".next").css({ opacity: "2" });
  }
  if (page === 1) {
    $(".back").attr("disabled", true);
    $(".back").css({ opacity: "0.5" });
  }
  if (pagea === "1") {
    $(".back").attr("disabled", true);
    $(".back").css({ opacity: "0.5" });
  } else {
    $(".back").attr("disabled", false);
    $(".back").css({ opacity: "2" });
  }
  $(".Btn").css({ opacity: "0.5" });
  $(`.Btn[value=${page}]`).css({ opacity: "5.0" });
}

var number = 1;
// -----------------------------
but(number);

function next(total) {
  number++;
  if (number <= total) {
    but(number, total);
  } else {
    but(current + 1, total);
  }
}

function back(total) {
  but(current - 1, total);
}

async function Up() {
  try {
    const name = $("#nameid").val();
    const thumbnail = $("#clickimg").val();
    const form = $("#form")[0];
    const formData = new FormData(form);
    const res = await $.ajax({
      url: `/category/${idupdate}?page=${current}&limit=10`,
      type: "PUT",
      data: formData,
      processData: false,
      contentType: false,
    });
    $("#close").trigger("click");
    $(".category").html("");
    $(".category").html(res);
  } catch (error) {
    console.log(error);
  }
}

var id = "";
async function xoa(a) {
  id = a;
}

async function deletethumbanail() {
  try {
    const res = await $.ajax({
      url: `/category/${id}?page=${current}&limit=10`,
      type: "DELETE",
    });
    console.log(186, res);
    $(".close").trigger("click");
    $(".category").html("");
    $(".category").html(res);
  } catch (error) {
    console.log(error);
  }
}
