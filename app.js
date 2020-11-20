const burguerMenu = document.querySelector(".burguer-menu");
const menuMobile = document.querySelector(".nav-ul");
const searchBar = document.querySelector("#search");
const apiKey = "DvB6aHwl4IkDw8dILVK69iWTbwQjvM5D";

const searchAutocomplete = async () => {
  try {
    const apiCall = await fetch(
      `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${searchBar.value}&limit=5`
    );
    const data = await apiCall.json();
    console.log(searchBar.value);
    console.log(data);
  } catch (err) {
    console.log("Hubo un error: ", err);
  }
};

searchBar.addEventListener("input", searchAutocomplete);

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
