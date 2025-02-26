var current = "";

async function but(page, total) {
  current = page;
  const res = await $.ajax({
    url: `/product/get?page=${page}&limit=5`,
    type: "GET",
  });

  // $(".button").html("");
  // $(".button").html(res);
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

$("#add-size").on("click", () => {
  const html = `<input type="text" class="select-size select-item col-6" placeholder="Kích thước (Nếu có) ">`;
  $("#add-size").before(html);
});

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
      for (var i = 0; i < files.length; i++) {
        fr.onload = function () {
          document.getElementById("change").src = fr.result;
        };
        fr.readAsDataURL(files[0]);
      }
    }
  },
  false
);

function readAsDataURL(files) {
  // target => <input type="file" id="file">
  var filesArray = Array.prototype.slice.call(files);
  return Promise.all(filesArray.map(fileToDataURL));
}

function fileToDataURL(file) {
  var reader = new FileReader();
  return new Promise(function (resolve, reject) {
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });
}

function importa() {
  document.getElementById("listimgid").click();
}

var fileToRead = document.getElementById("listimgid");

fileToRead.addEventListener(
  "change",
  function () {
    var files = fileToRead.files;
    if (files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        document.getElementsByClassName("changeimg").src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
  },
  false
);

let form1 = $("form")[0];
async function addDetail() {
  var listSize = [];
  for (let i = 0; i < $(".select-size").length; i++) {
    listSize.push($(".select-size").eq(i).val());
  }
  const color = $("#color").val().trim();
  const quantity = $("#quantity").val();
  try {
    if (quantity * 1 > 0) {
      const form = $("form")[0];
      const formData = new FormData(form);
      await $.ajax({
        url: `/product/add?color=${color}&quantity=${
          quantity * 1
        }&listSize=${listSize}`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
      });
      window.location.reload();
    } else {
      alert("Số lượng sản phẩm không phù hợp");
    }
  } catch (error) {
    alert(error.responseJSON.message);
  }
}

async function xoaproduct(id) {
  try {
    await $.ajax({
      url: "/product/" + id,
      type: "DELETE",
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

var idupdate = "";
async function up(value) {
  console.log("value: ", value);
  const { _id, color, size, quantity, illustration } = JSON.parse(value);
  console.log("illustration: ", illustration);
  console.log("size: ", size);
  $("#colorid").val(color);
  // $("#sizeid").val(size);
  $("#quantityid").val(quantity);
  $("#changeIllustration").attr("src", illustration);
  idupdate = _id;
}

async function update() {
  try {
    const form = $("#form")[0];
    const formData = new FormData(form);
    const res = await $.ajax({
      url: `/product/${idupdate}?page=${current}&limit=5`,
      type: "PUT",
      data: formData,
      processData: false,
      contentType: false,
    });
    $("#Close").trigger("click");
    $(".button").html("");
    $(".button").html(res);
  } catch (error) {
    console.log(error);
  }
}
