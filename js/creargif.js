const btnInit = document.querySelector("#btn-init");
const btnRecord = document.querySelector("#btn-record");
const btnStopRecord = document.querySelector("#btn-stop-record");
const btnUpload = document.querySelector("#btn-upload");
const seconds = document.getElementById("seconds");
const numberOne = document.querySelector("#number-one");
const numberTwo = document.querySelector("#number-two");
const numberThree = document.querySelector("#number-three");
const innerTitle = document.getElementById("inner-title");
const innerText = document.getElementById("inner-text");
const innerFrame = document.querySelector(".inner-frame");
const video = document.getElementById("myVideo");

let recordRTC = null;
let videoURL = "";
let options = {
  type: "video",
  video: { width: 320, height: 240 },
  canvas: { width: 320, height: 240 },
};
let cantidadFavoritosGuardados = 0;
let intervalID;

const init = () => {
  try {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
  } catch (e) {
    window.alert("Your browser does not support WebVideo, try Google Chrome");
  }
  if (navigator.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then(async function (stream) {
        recordRTC = new RecordRTC(stream, {
          type: "gif",
        });
        let video = document.getElementById("myVideo");
        video.srcObject = stream;
        video.play();
        numberOne.classList.remove("number-active");
        numberTwo.classList.add("number-active");
        innerTitle.style.display = "none";
        innerText.textContent =
          "El acceso a la cámara será válido solo por el tiempo en el que estés creando el GIFO";
        innerFrame.style.padding = "30px";
        btnInit.style.display = "none";
        btnRecord.style.display = "block";
      });
  } else {
    window.alert("Your browser does not support recording, try Google Chrome");
  }
};

const record = () => {
  recordRTC.startRecording();
  seconds.style.display = "block";
  btnRecord.style.display = "none";
  btnStopRecord.style.display = "block";
  innerText.style.display = "none";
  let n = 0;
  intervalID = window.setInterval(() => {
    if (n < 10) {
      seconds.textContent = "00:0" + n;
    } else {
      seconds.textContent = "00:" + n;
    }
    n++;
  }, 1000);
};

const stop = () => {
  recordRTC.stopRecording(function () {
    const img = document.createElement("img");
    innerFrame.appendChild(img);
    blob = recordRTC.getBlob();
    img.src = window.URL.createObjectURL(blob);
    cantidadFavoritosGuardados++;
    video.style = "display: none;";
  });
  window.clearInterval(intervalID);
  btnStopRecord.style.display = "none";
  btnUpload.style.display = "block";
  numberTwo.classList.remove("number-active");
  numberThree.classList.add("number-active");
  btnUpload.addEventListener("click", uploadGif);
};

const createdGifs =
  JSON.parse(localStorage.getItem("createdGifs")) === null
    ? []
    : JSON.parse(localStorage.getItem("createdGifs"));

const uploadGif = async () => {
  btnUpload.style.fontSize = "20px";
  btnUpload.innerHTML = '<i class="fas fa-spinner fa-spin fa-sw"></i>';
  let successMsg = document.querySelector(".success-msg");
  let errorMsg = document.querySelector(".error-msg");
  let formData = new FormData();
  formData.append("file", recordRTC.getBlob(), "myGif.gif");
  try {
    const apiCall = await fetch(
      `https://upload.giphy.com/v1/gifs?api_key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const resp = await apiCall.json();
    createdGifs.push(resp.data.id);
    localStorage.setItem("createdGifs", JSON.stringify(createdGifs));
    if (resp.meta.status === 200) {
      successMsg.style.display = "block";
      btnUpload.style.display = "none";
    }
  } catch (err) {
    errorMsg.style.display = "block";
    btnUpload.removeEventListener("click", uploadGif);
    btnUpload.textContent = "reintentar";
    btnUpload.style.fontSize = "13.3px";
    btnUpload.addEventListener("click", () => {
      location.reload();
      return false;
    });
  }
};

function load() {
  img.src = videoURL;
}
