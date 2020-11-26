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

//Función para mosrar los GIFs buscados
const showSearchGifs = async (word) => {
  const gifsResultsSection = document.querySelector(".gifs-results");
  gifsResultsSection.innerHTML = "";
  try {
    const apiCall = await fetch(
      `${apiUrl}gifs/search?limit=12&q=${word}&api_key=${apiKey}`
    );
    const gifs = await apiCall.json();
    let title = document.createElement("h4");
    title.textContent = word;
    gifsResultsSection.appendChild(title);
    const gifsResultsContainer = document.createElement("div");
    gifsResultsContainer.classList.add("gifs-results-container");
    gifsResultsSection.appendChild(gifsResultsContainer);
    gifs.data.map((gif) => {
      let newGif = document.createElement("img");
      newGif.src = gif.images.original.url;
      gifsResultsContainer.appendChild(newGif);
    });
    let btn = document.createElement("button");
    btn.textContent = "ver más";
    btn.classList.add("btn");
    gifsResultsSection.appendChild(btn);
  } catch (err) {
    errorHandler(err);
  }
};

//Función de autocompletado de texto y búsqueda de Gifs en la barra de búsqueda
const searchAutocomplete = async () => {
  const autoCompleteBox = document.querySelector(".autocomplete-box");
  autoCompleteBox.innerHTML = "";
  //Creando el UL que contendrá los términos de autocompletado
  let autoCompleteResultsList = document.createElement("ul");
  autoCompleteResultsList.classList.add("autocomplete-results-list");
  autoCompleteBox.appendChild(autoCompleteResultsList);
  try {
    const apiCall = await fetch(
      `${apiUrl}gifs/search/tags?lang=es&q=${searchBar.value}&api_key=${apiKey}`
    );
    const autoCompleteWords = await apiCall.json();
    //Creando el icono de lupa para cada término nuevo
    let searchIcon = document.querySelector("#search-icon");
    searchIcon.setAttribute("src", "./assets/close.svg");
    searchIcon.style.cursor = "pointer";
    //Creando cada elemento LI por cada término de autocompletado y añadiendo el ícono de lupa
    autoCompleteWords.data.map((word) => {
      let autocompleteSearchIcon = document.createElement("img");
      autocompleteSearchIcon.src = "./assets/icon-search.svg";
      let newWord = document.createElement("li");
      newWord.textContent = word.name;
      newWord.appendChild(autocompleteSearchIcon);
      //Listener para que al dar click en un resultado sugerido, este se vuelva el valor del searchBar
      newWord.addEventListener("click", () => {
        searchBar.value = word.name;
        autoCompleteResultsList.remove();
        showSearchGifs(word.name);
      });
      autoCompleteResultsList.appendChild(newWord);
    });
    //Función para eliminar los resultados y lo escrito en el searchBar y cambiando el ícono por la lupa
    searchIcon.addEventListener("click", () => {
      searchBar.value = "";
      autoCompleteResultsList.remove();
      searchIcon.setAttribute("src", "./assets/icon-search.svg");
      searchIcon.style.cursor = "default";
    });
  } catch (err) {
    errorHandler(err);
  }
};

searchBar.addEventListener("keyup", searchAutocomplete);
searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchBar.value.length > 0) {
    showSearchGifs(searchBar.value);
  }
});

//Función para mostrar las categorías trending (texto)
const trendingCategories = async () => {
  const container = document.querySelector(".trending-categories");
  try {
    const apiCall = await fetch(`${apiUrl}trending/searches?api_key=${apiKey}`);
    const trending = await apiCall.json();
    trending.data.map((elem, index) => {
      // Creando cada elemento hasta un máximo de 5 elementos. Al último no se le pone coma ","
      if (index <= 4) {
        const categories = document.createElement("span");
        if (index === 4) {
          categories.textContent = `${elem}`;
        } else {
          categories.textContent = `${elem}, `;
        }
        categories.addEventListener("click", () => {
          showSearchGifs(elem);
        });
        container.appendChild(categories);
      }
    });
  } catch (err) {
    errorHandler(err);
  }
};

trendingCategories();

//Función para mosrar los GIFs en tendencia
const trendingGifs = async () => {
  const gifsContainer = document.querySelector(".gifs-container");
  try {
    const apiCall = await fetch(
      `${apiUrl}gifs/trending?limit=3&rating=g&api_key=${apiKey}`
    );
    const trendingGifs = await apiCall.json();
    trendingGifs.data.map((elem) => {
      let img = document.createElement("img");
      img.src = elem.images.original.url;
      img.alt = "Gif";
      gifsContainer.appendChild(img);
    });
  } catch (err) {
    errorHandler(err);
  }
};

trendingGifs();
