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

function init() {
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
}

function record() {
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
}

function stop() {
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
  btnUpload.addEventListener("click", uploadGif);
}

function uploadGif() {
  numberTwo.classList.remove("number-active");
  numberThree.classList.add("number-active");
  let formData = new FormData();
  formData.append("file", recordRTC.getBlob(), "myGif.gif");
  let finalGif = formData.get("file");
  console.log(finalGif);

  fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) =>
      localStorage.setItem(
        "favoritos" + cantidadFavoritosGuardados,
        data.data.id
      )
    );
  btnUpload.style.display = "none";
}

function load() {
  img.src = videoURL;
}
