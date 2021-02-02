const displayMisGifs = () => {
  const section = document.querySelector(".mis-gifs-results");
  let icon = document.createElement("img");
  icon.src = "./assets/icon-mis-gifos-sin-contenido.svg";
  icon.alt = "Icono mis favoritos";
  icon.classList.add("icon-fav-nocontent");
  let text = document.createElement("h2");
  text.textContent = `¡Anímate a crear tu propio GIFO!`;
  section.appendChild(icon);
  section.appendChild(text);
};

displayMisGifs();
