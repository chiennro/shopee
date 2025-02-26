// * Process log out account now
async function logout() {
  try {
    await $.ajax({
      type: "PUT",
      url: "/user/logout",
    });
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
  }
}

// * Search product by name
$("#search").focus(() => {
  $(".searchtong").toggle();
  document.onkeydown = (e) => {
    if (e.code === "Enter") {
      searchBtn();
    }
  };
});

async function searchBtn() {
  const search = $("#search").val().trim();
  try {
    if (search == "") {
      window.location.href = "/";
    } else {
      window.location.href = `/search?keyword=${
        search.includes(" ") ? search.split(" ").join("+") : search
      }&page=1&sort=popularity`;
    }
  } catch (error) {
    console.log(error);
  }
}

// * Process loading time to render interface
setTimeout(() => {
  $(".loader").attr("style", "display : none");
  $("#loading").attr("style", "display : block");
}, 2000);
