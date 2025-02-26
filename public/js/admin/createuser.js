var a = "";
var current;
async function but(page, total) {
  current = page;
  const res = await $.ajax({
    url: `/user/admin/get?page=${page}&limit=10`,
    type: "GET",
  });
  $(".user").html("");
  $(".user").html(res);
  console.log(11, page, total);
  const doi = String(page);
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
    $(".next").css({ opacity: "10" });
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
    $(".back").css({ opacity: "10" });
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

var idedit = "";

async function edit(id) {
  $(".modal-body").html("");
  const res = await $.ajax({
    url: "/user/" + id,
    type: "GET",
  });
  div = `
   <table>
    <tr>
      <td><img src="${res.avatar}" alt="" class="imgthumbnail" id='anhday'></td>
      <td class='nameday'><span>Name:</span> ${res.username}</td>
      <td class='roleday'><span>Role:</span>
        <select name="" id="editrole">
          <option value="user" ${
            res.role === "user" ? "selected='selected'" : ""
          }>user</option>
          <option value="admin" ${
            res.role === "admin" ? "selected='selected'" : ""
          }>admin</option>
        </select>
      </td>
    </tr>
   </table>
  `;
  $(".modal-body").append(div);
  idedit = id;
}

async function save() {
  try {
    const role = $("#editrole").val();
    const res = await $.ajax({
      url: `/user/${idedit}?page=${current}&limit=10`,
      type: "PUT",
      data: {
        role: role,
      },
    });
    $(".Close").trigger("click");
    $(".user").html("");
    $(".user").html(res);
  } catch (error) {
    console.log(error);
  }
}
