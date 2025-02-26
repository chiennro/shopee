let url = window.location.href;
let numPage = url.split("=")[1];
if (url.split("/")[url.split("/").length - 1] == "pagination") {
  numPage = 1;
}
$(`#page-${numPage}`).addClass("active");

$.ajax({
  url: "/codeProduct/count",
  type: "GET",
}).then((data) => {
  console.log(data);
  if (numPage == 1) {
    $(".page-pre").off("click");
    $(".page-pre").attr("style", "opacity : 0.5; pointer-events: none;");
  } else {
    $(".page-pre").attr("style", "opacity : 1; ");
    $(".page-pre").on("click", () => {
      numPage = numPage - 1;
      $(`#page-${numPage}`).trigger("click");
    });
  }

  if (numPage == data) {
    $(".page-next").off("click");
    $(".page-next").attr("style", "opacity : 0.5 ; pointer-events: none");
  } else {
    $(".page-next").attr("style", "opacity : 1; ");
    $(".page-next").on("click", () => {
      numPage = numPage * 1 + 1;
      $(`#page-${numPage}`).trigger("click");
    });
  }
});

async function btnPage(page, listPage) {
  let numPage = page * 1;
  try {
    // $(".page-number").removeClass("active");
    // $("#page-" + page).addClass("active");
    // // Previous
    // $(".page-pre").on("click", () => {
    //   numPage = numPage - 1;
    //   $(`#page-${numPage}`).trigger("click");
    // });
    // if (numPage == 1) {
    //   $(".page-pre").off("click");
    //   $(".page-pre").attr("style", "opacity : 0.5; pointer-events: none;");
    // } else {
    //   $(".page-pre").attr("style", "opacity : 1; ");
    // }
    // Next
    // $(".page-next").on("click", () => {
    //   numPage = numPage + 1;
    //   $(`#page-${numPage}`).trigger("click");
    // });
    // if (numPage == listPage) {
    //   $(".page-next").off("click");
    //   $(".page-next").attr("style", "opacity : 0.5 ; pointer-events: none");
    // } else {
    //   $(".page-next").attr("style", "opacity : 1; ");
    // }
    // const res = await $.ajax({
    //   type: "GET",
    //   url: `/codeProduct/pagination?page=${numPage}`,
    // });
    // $(".product-list").html(res);
    window.location.href = "/pagination?page=" + page;
  } catch (error) {
    console.log(error);
  }
}
