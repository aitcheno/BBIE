// GET ELEMENTS
const audio = document.getElementById("custom-audio-player");

const playBtn = document.getElementById("play-pause-btn");
const playImg = document.getElementById("play-pause-img");

const progressFill = document.getElementById("progress-bar-fill");
const progressBar = document.querySelector(".progress-bar");

const volumeSlider = document.getElementById("volume-slider");
const muteBtn = document.getElementById("mute-btn");
const muteIcon = document.getElementById("mute-icon");

let lastVolume = volumeSlider.value;


// PLAY / PAUSE
playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    await audio.play();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    audio.pause();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
});


// PROGRESS BAR
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const progress = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = progress + "%";
});


// SEEKING
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;

  audio.currentTime = (clickX / rect.width) * audio.duration;
});


// SET VOLUME INITIALLY
audio.volume = volumeSlider.value;


// VOLUME SLIDER
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;

  if (audio.volume == 0) {
    muteIcon.src = "assets/no-audio.png";
  } else {
    muteIcon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
    lastVolume = audio.volume;
  }
});


// MUTE / UNMUTE
muteBtn.addEventListener("click", () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    muteIcon.src = "assets/no-audio.png";
  } else {
    audio.volume = lastVolume || 1;
    volumeSlider.value = audio.volume;
    muteIcon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
  }
});