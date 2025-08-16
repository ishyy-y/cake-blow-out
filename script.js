document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const messageBox = document.getElementById("messageBox");
  let candles = [];
  let audioContext, analyser, microphone;

  const cheerAudio = new Audio("cheer.mp3");
  const happySong = new Audio("happy.mp3"); // add happy birthday song

  // Step 1: Initial instruction
  messageBox.innerText = "🎂 Touch on the cake to light the candles";

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);

    if (candles.length === 22) {
      // Step 2: Show Happy Birthday Song lyrics
      messageBox.innerText =
        "🎵 Happy Birthday to you 🎵\n🎵 Happy Birthday to you 🎵\n🎵 Happy Birthday dear Baby 🎵\n🎵 Happy Birthday to you 🎵";
      happySong.play();

      // After song ends → Step 3 instruction
      happySong.onended = () => {
        messageBox.innerText = "🎤 What will you do now?\nBlow the candles!";
      };
    }
  }

  cake.addEventListener("click", function (event) {
    if (candles.length < 22) {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
    }
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
    return sum / bufferLength > 40;
  }

  function blowOutCandles() {
    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out")) {
          candle.classList.add("out");
        }
      });

      const active = candles.filter(c => !c.classList.contains("out")).length;
      if (active === 0 && candles.length >= 22) {
        // Step 4: Final message
        messageBox.innerText = "👩🏽‍❤️‍💋‍👨🏻 Happy 22nd my baby! 👩🏽‍❤️‍💋‍👨🏻";
        cheerAudio.play();
        clearInterval(blowCheck);
      }
    }
  }

  let blowCheck;
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        blowCheck = setInterval(blowOutCandles, 200);
      })
      .catch(err => console.log("Mic access error: " + err));
  }
});
