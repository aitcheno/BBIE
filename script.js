// Get elements
const audio = document.getElementById("custom-audio-player");
const playBtn = document.getElementById("play-pause-btn");
const playImg = document.getElementById("play-pause-img");
const progressFill = document.getElementById("progress-bar-fill");
const progressBar = document.querySelector(".progress-bar");


// Play / Pause
playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
    } catch (err) {
      console.error("Audio play failed:", err);
    }
  } else {
    audio.pause();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
});


// Audio Load
audio.addEventListener("loadedmetadata", () => {
  console.log("Audio ready");
});


// Progress Bar
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const progress = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = progress + "%";
});


// Seeking
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;

  audio.currentTime = (clickX / rect.width) * audio.duration;
});