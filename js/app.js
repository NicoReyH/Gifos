const apiKey = "DvB6aHwl4IkDw8dILVK69iWTbwQjvM5D";
const apiUrl = "https://api.giphy.com/v1/";
const burguerMenu = document.querySelector(".burguer-menu");
const searchBar = document.querySelector("#search");

//Función para cambiar el ícono del burguer menú por una X en mobile
const showHideMenu = () => {
  const menuMobile = document.querySelector(".nav-ul");
  if (menuMobile.style.left == "-100%") {
    menuMobile.style.left = "0";
    burguerMenu.setAttribute("src", "./assets/close.svg");
  } else {
    menuMobile.style.left = "-100%";
    burguerMenu.setAttribute("src", "./assets/burger.svg");
  }
};

burguerMenu.addEventListener("click", showHideMenu);

//Función para manejar errores de fetch en las funciones
const errorHandler = (error) => console.error("Hubo un error: ", error);

//Array en donde se almacenarán los Gifs que el usuario marque como favoritos
const savedFavoriteGifs = [];

//Función para agregar Gif a favoritos
const addGifToFavorites = (gif, event) => {
  savedFavoriteGifs.push(gif);
  localStorage.setItem("favoriteGifs", JSON.stringify(savedFavoriteGifs));
  if (event.target.classList.contains("far")) {
    event.target.classList.remove("far");
    event.target.classList.add("fas");
  } else {
    event.target.classList.remove("fas");
    event.target.classList.add("far");
  }
};

//Función para descargar GIf
const downloadGif = async (url, title) => {
  //create new a element
  let a = document.createElement("a");
  // get image as blob
  let response = await fetch(url);
  let file = await response.blob();
  // use download attribute https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes
  a.download = title;
  a.href = window.URL.createObjectURL(file);
  //store download url in javascript https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access
  a.dataset.downloadurl = ["application/octet-stream", a.download, a.href].join(
    ":"
  );
  //click on element to start download
  a.click();
};

//Función para activar el modal
const displayModalGif = (gifUrl, gifTitle, gifUserName) => {
  let gif = document.querySelector("#gif-to-modal");
  let username = document.querySelector("#modal-username");
  let title = document.querySelector("#modal-gif-title");
  let modal = document.querySelector(".modal");
  let closeBtn = document.querySelector(".close-btn");
  gif.src = gifUrl;
  title.textContent = gifTitle;
  username.textContent = gifUserName;

  modal.style.display = "flex";
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  };
};

//Función para crear cada Gif, agregarle el overlay con diseño e íconos y hacerle append al contenedor
const createAndDisplayGifs = async (
  gifData,
  containerToAppend,
  sectionContainer
) => {
  gifData.map((gif, index) => {
    let gifUrl = gif.images.downsized_medium.url;
    let gifContainer = document.createElement("div");
    gifContainer.classList.add("gif-container");
    containerToAppend.appendChild(gifContainer);
    let newGif = document.createElement("img");
    newGif.src = gifUrl;
    newGif.alt = "Gif";
    gifContainer.appendChild(newGif);
    let gifOverlay = document.createElement("div");
    gifOverlay.classList.add("gif-overlay");
    gifContainer.appendChild(gifOverlay);
    let gifIcons = document.createElement("div");
    gifIcons.classList.add("gif-icons");
    gifOverlay.appendChild(gifIcons);
    let favIcon = document.createElement("i");
    favIcon.classList.add("far", "fa-heart");
    favIcon.onclick = (e) => addGifToFavorites(gif, e);
    gifIcons.appendChild(favIcon);
    let downloadIcon = document.createElement("i");
    downloadIcon.classList.add("fas", "fa-download");
    downloadIcon.onclick = () => downloadGif(gifUrl, gif.title);
    gifIcons.appendChild(downloadIcon);
    let maxIcon = document.createElement("i");
    maxIcon.classList.add("fas", "fa-expand-alt");
    const modalFunctionality = () => {
      displayModalGif(gifUrl, gif.title, gif.username);
      let likeBtn = document.querySelector("#modal-like-btn");
      let downloadBtn = document.querySelector("#modal-download-btn");
      likeBtn.onclick = () => addGifToFavorites(gif);
      downloadBtn.onclick = () => downloadGif(gifUrl, gif.title);
    };
    maxIcon.onclick = () => modalFunctionality();
    gifIcons.appendChild(maxIcon);
    let gifInfo = document.createElement("div");
    gifInfo.classList.add("gif-info");
    gifOverlay.appendChild(gifInfo);
    let username = document.createElement("span");
    username.textContent = gif.username;
    gifInfo.appendChild(username);
    let gifTitle = document.createElement("span");
    gifTitle.textContent = gif.title;
    gifInfo.appendChild(gifTitle);
    if (index > 11) {
      gifContainer.classList.add("hide");
    }
    newGif.onclick = () => {
      modalFunctionality();
    };
  });

  // Agregar botón de ver más
  if (sectionContainer) {
    const loadMoreGifsBtn = document.createElement("button");
    loadMoreGifsBtn.textContent = "ver más";
    loadMoreGifsBtn.classList.add("load-more-btn");
    sectionContainer.appendChild(loadMoreGifsBtn);
    loadMoreGifsBtn.addEventListener("click", () => {
      let hidGifs = document.querySelectorAll(".hide");
      hidGifs.forEach((gif, index) => {
        if (index <= 11) {
          gif.classList.remove("hide");
        }
      });
      if (hidGifs.length === 2) {
        loadMoreGifsBtn.classList.add("hide");
      }
    });
  } else {
    return;
  }
};

//Función para mosrar los GIFs buscados en la barra de búsqueda
const showSearchedGifs = async (word) => {
  const gifsResultsSection = document.querySelector(".gifs-results");
  gifsResultsSection.innerHTML = "";
  try {
    const apiCall = await fetch(
      `${apiUrl}gifs/search?q=${word}&api_key=${apiKey}`
    );
    const gifs = await apiCall.json();
    let title = document.createElement("h4");
    title.textContent = word;
    gifsResultsSection.appendChild(title);
    let gifsResultsContainer = document.createElement("div");
    gifsResultsContainer.classList.add("gifs-results-container");
    gifsResultsSection.appendChild(gifsResultsContainer);
    await createAndDisplayGifs(
      gifs.data,
      gifsResultsContainer,
      gifsResultsSection
    );
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
        showSearchedGifs(word.name);
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

//Listeners para ejecutar la búsqueda desde el searchbar
if (searchBar) {
  searchBar.addEventListener("keyup", searchAutocomplete);
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchBar.value.length > 0) {
      showSearchedGifs(searchBar.value);
    }
  });
}

//Función para mostrar las categorías trending (texto)
(async () => {
  const container = document.querySelector(".trending-categories");
  if (container) {
    try {
      const apiCall = await fetch(
        `${apiUrl}trending/searches?api_key=${apiKey}`
      );
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
            showSearchedGifs(elem);
          });
          container.appendChild(categories);
        }
      });
    } catch (err) {
      errorHandler(err);
    }
  }
})();

//Función para mosrar los GIFs en tendencia
(async () => {
  const trendingGifsContainer = document.querySelector(
    ".trending-gifs-container"
  );
  if (trendingGifsContainer) {
    try {
      const apiCall = await fetch(
        `${apiUrl}gifs/trending?limit=3&rating=g&api_key=${apiKey}`
      );
      const trendingGifs = await apiCall.json();
      await createAndDisplayGifs(trendingGifs.data, trendingGifsContainer);
    } catch (err) {
      errorHandler(err);
    }
  }
})();
