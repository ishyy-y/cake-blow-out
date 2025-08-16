const messageBox = document.getElementById("messageBox");
const birthdayMessage = document.getElementById("birthdayMessage");

const happySong = new Audio("happy.mp3");
const cheer = new Audio("cheer.mp3");

const flames = document.querySelectorAll(".flame");

let candlesLit = false;
let songFinished = false;
let finalMessageShown = false;

// STEP 1: Light candles on first tap
document.body.addEventListener("click", () => {
  if (!candlesLit) {
    candlesLit = true;
    messageBox.textContent = "Me trying to pronounce them correctly!";
    return;
  }

  // STEP 2: Blow candles after tap (while song hasn't started)
  if (candlesLit && !songFinished && flames.length > 0) {
    blowCandlesRandom();
    return;
  }

  // STEP 3: After song ends → next tap shows final message
  if (songFinished && !finalMessageShown) {
    messageBox.textContent = "What will you do now?/n Make a wish and blow the candles";
    finalMessageShown = true;
  }
});

function blowCandlesRandom() {
  let remainingFlames = Array.from(flames);

  function extinguishOne() {
    if (remainingFlames.length === 0) {
      // All candles out → play cheer + show Happy 22nd
      cheer.play();
      showBirthdayMessage();
      playHappySong();
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingFlames.length);
    const flame = remainingFlames[randomIndex];
    flame.style.display = "none";
    remainingFlames.splice(randomIndex, 1);

    setTimeout(extinguishOne, 400); // extinguish one every 0.4s
  }

  extinguishOne();
}

function showBirthdayMessage() {
  birthdayMessage.classList.add("show");
}

function playHappySong() {
  happySong.play();
  happySong.onended = () => {
    songFinished = true;
    // Next tap → "What will you do now?"
  };
}
