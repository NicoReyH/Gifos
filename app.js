const apiKey = "DvB6aHwl4IkDw8dILVK69iWTbwQjvM5D";
const apiUrl = "https://api.giphy.com/v1/";
const burguerMenu = document.querySelector(".burguer-menu");
const searchBar = document.querySelector("#search");

//Función para cambiar el ícono del burguer menú por una X
const showHideMenu = () => {
  const menuMobile = document.querySelector(".nav-ul");
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

//Función para manejar errores de fetch en las funciones
const errorHandler = (error) => console.log("Hubo un error: ", error);

//Función de autocompletado de texto en la barra de búsqueda
const searchAutocomplete = async () => {
  try {
    const apiCall = await fetch(
      `${apiUrl}gifs/search/tags?lang=es&q=${searchBar.value}&api_key=${apiKey}`
    );
    const data = await apiCall.json();
    console.log(data);
  } catch (err) {
    errorHandler(err);
  }
};

searchBar.addEventListener("input", searchAutocomplete);

//Función para mostrar las categorías trending (texto)
const trendingCategories = async () => {
  const container = document.querySelector(".trending-container");
  try {
    const apiCall = await fetch(`${apiUrl}trending/searches?api_key=${apiKey}`);
    const trending = await apiCall.json();
    trending.data.map((elem, index) => {
      // Creando cada elemento hasta un máximo de 5 elementos. Al último no se le pone coma ","
      const categories = document.createElement("span");
      if (index <= 4) {
        if (index === 4) {
          categories.textContent = `${elem}`;
        } else {
          categories.textContent = `${elem}, `;
        }
      }
      container.appendChild(categories);
    });
  } catch (err) {
    errorHandler(err);
  }
};

trendingCategories();
