const burguerMenu = document.querySelector(".burguer-menu");
const menuMobile = document.querySelector(".nav-ul");

//Función para cambiar el ícono del burguer menú por una X
const showHideMenu = () => {
  if (
    menuMobile.style.left === "-100%" &&
    burguerMenu.getAttribute("src") === "./assets/burger.svg"
  ) {
    menuMobile.style.left = "0";
    burguerMenu.setAttribute("src", "./assets/close.svg");
  } else {
    menuMobile.style.left = "-100%";
    burguerMenu.setAttribute("src", "./assets/burger.svg");
  }
};

burguerMenu.addEventListener("click", showHideMenu);
