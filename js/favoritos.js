(() => {
  const favoriteGifsSection = document.querySelector(".favorite-gifs-results");
  const gifsOnLocalStorage = JSON.parse(localStorage.getItem("favoriteGifs"));

  //Recuperar los gifs IDs del localStorage y hacer fetch como en misgifs.js para mostrar los gifs guardados. Verificar que no se repitan y agregarles el ícono de favorito.

  if (favoriteGifsSection) {
    if (gifsOnLocalStorage) {
      let favoriteGifContainer = document.createElement("div");
      favoriteGifContainer.classList.add("gifs-results-container");
      favoriteGifsSection.appendChild(favoriteGifContainer);
      createAndDisplayGifs(gifsOnLocalStorage, favoriteGifContainer);
    } else {
      let icon = document.createElement("img");
      icon.src = "./assets/icon-fav-sin-contenido.svg";
      icon.alt = "Icono favoritos grande";
      icon.classList.add("icon-fav-nocontent");
      let text = document.createElement("h2");
      text.textContent = `¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!`;
      favoriteGifsSection.appendChild(icon);
      favoriteGifsSection.appendChild(text);
    }
  }
})();
