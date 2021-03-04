let myGifs = JSON.parse(localStorage.getItem("createdGifs")).map((id) => id);
console.log(myGifs.join());

const getMyGifs = async () => {
  const getData = await fetch(
    `${apiUrl}gifs?ids=${myGifs.join()}&api_key=${apiKey}`
  );
  const gifs = await getData.json();
  console.log(gifs);
  //Crear los gifs y mostrarlos con la data que viene del fetch

  //Hacer el if/else para mostrar los Gifs creados o lo que ya está creado abajo
};

(() => {
  const section = document.querySelector(".mis-gifs-results");
  let icon = document.createElement("img");
  icon.src = "./assets/icon-mis-gifos-sin-contenido.svg";
  icon.alt = "Icono mis favoritos";
  icon.classList.add("icon-fav-nocontent");
  let text = document.createElement("h2");
  text.textContent = `¡Anímate a crear tu propio GIFO!`;
  section.appendChild(icon);
  section.appendChild(text);

  getMyGifs();
})();
