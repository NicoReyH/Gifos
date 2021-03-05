const section = document.querySelector(".mis-gifs-results");
let myGifsfromLocalStorage =
  JSON.parse(localStorage.getItem("createdGifs")) === null
    ? []
    : JSON.parse(localStorage.getItem("createdGifs"));

const getMyGifs = async () => {
  const getData = await fetch(
    `${apiUrl}gifs?ids=${myGifsfromLocalStorage.join()}&api_key=${apiKey}`
  );
  const gifs = await getData.json();
  let myGifsGifContainer = document.createElement("div");
  myGifsGifContainer.classList.add("gifs-results-container");
  section.appendChild(myGifsGifContainer);
  createAndDisplayGifs(gifs.data, myGifsGifContainer);
};

(() => {
  if (myGifsfromLocalStorage.length > 0) {
    getMyGifs();
  } else {
    let icon = document.createElement("img");
    icon.src = "./assets/icon-mis-gifos-sin-contenido.svg";
    icon.alt = "Icono mis favoritos";
    icon.classList.add("icon-fav-nocontent");
    let text = document.createElement("h2");
    text.textContent = `¡Anímate a crear tu propio GIFO!`;
    section.appendChild(icon);
    section.appendChild(text);
  }
})();
