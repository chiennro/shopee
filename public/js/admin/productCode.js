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

function impor() {
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

async function add() {
  try {
    const code = $("#code").val();
    const name = $("#name").val();
    const clickavatar = $("#clickavatar").val();
    const category = $("#category").val();
    const price = $("#price").val();
    const linkYoutube = $("#linkYoutube").val();
    if (code == "") {
      $(".note1").text("Vui lòng điền mã code sản phẩm");
    }
    if (name == "") {
      $(".note2").text("Vui lòng điền tên sản phẩm");
    }
    if (clickavatar == "") {
      $(".note3").text("Vui lòng ảnh sản phẩm");
    }
    if (category == "") {
      $(".note4").text("Vui lòng nhập phân loại sản phẩm");
    }
    if (price == "") {
      $(".note5").text("Vui lòng nhập giá tiền sản phẩm");
    } else {
      const form = $("form")[0];
      const formData = new FormData(form);
      const res = await $.ajax({
        url: "/codeProduct/add",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
      });
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}
var id = "";
async function xoa(a) {
  id = a;
}

var idupdate = "";

async function update(id) {
  idupdate = id;
  const res = await $.ajax({
    url: "/codeProduct/" + id,
    type: "GET",
  });
  $(".code").val(res.code);
  $(".name").val(res.name);
  $("#changeimg").attr("src", res.thumbnail);
  $(".price").val(res.price);
  $(".linkYoutube").val(res.linkYoutube);
}

var current = "";

async function but(page, total) {
  current = page;
  const res = await $.ajax({
    url: `/codeProduct/get?page=${page}&limit=12`,
    type: "GET",
  });
  $(".butt").html("");
  $(".butt").html(res);
  console.log(140, page, total);
  const pagea = String(page);
  if (page >= total) {
    $(".next").attr("disabled", true);
    $(".next").css({ opacity: "0.5" });
  }
  if (pagea >= total) {
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
but(number);

async function next(total) {
  number++;
  but(number, total);
}
async function back(total) {
  number--;
  but(number, total);
}

async function Save() {
  const code = $(".code").val();
  const name = $(".name").val();
  const thumbnail = $("#clickimg").val();
  const category = $(".category").val();
  const price = $(".price").val();
  const form = $("#form")[0];
  const formData = new FormData(form);
  const res = await $.ajax({
    url: `/codeProduct/${idupdate}?page=${current}&limit=12`,
    type: "PUT",
    data: formData,
    processData: false,
    contentType: false,
  });
  $("#close").trigger("click");
  $(".butt").html("");
  $(".butt").html(res);
}

async function yes() {
  const res = await $.ajax({
    url: `/codeProduct/${id}?page=${current}&limit=12`,
    type: "DELETE",
  });
  $(".closae").trigger("click");
  $(".butt").html("");
  $(".butt").html(res);
}
