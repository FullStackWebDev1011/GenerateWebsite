window.onload = function () {
  // if (window.innerWidth <= 767) {
  // document.getElementById("social-chat-image").src =
  //   "assets/social-shopping/chat-mobile.svg";
  // document.getElementById("social-filters-image").src =
  //   "assets/social-shopping/filters-mobile-1.svg";
  // }
};

function navbarMenuHandler() {
  if (window.innerWidth > 767) return;
  var x = document.getElementById("nav-bar-items");
  if (x.style.display === "flex") {
    x.style.opacity = 0;
    setTimeout(() => {
      x.style.display = "none";
    }, 250);
  } else {
    x.style.display = "flex";
    setTimeout(() => {
      x.style.opacity = 1;
    }, 5);
  }
}

function navbarMenuItemHandler() {
  if (window.innerWidth > 767) return;
  var x = document.getElementById("nav-bar-items");
  x.style.opacity = 0;
  setTimeout(() => {
    x.style.display = "none";
  }, 250);
}

function scrollToTop() {
  window.scroll({ top: 0, left: 0, behavior: "smooth" });
}
