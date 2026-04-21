// Get elements
const video = document.getElementById("custom-video-player");
const playBtn = document.getElementById("play-pause-btn");
const playImg = document.getElementById("play-pause-img");
const progressFill = document.getElementById("progress-bar-fill");
const progressBar = document.querySelector(".progress-bar");


// Play / Pause 
function togglePlayPause() {
  if (video.paused) {
    video.play();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    video.pause();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

playBtn.addEventListener("click", togglePlayPause);


// Progress Bar
video.addEventListener("timeupdate", () => {
  const progress = (video.currentTime / video.duration) * 100;
  progressFill.style.width = progress + "%";
});


// Seeking
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;

  const newTime = (clickX / rect.width) * video.duration;
  video.currentTime = newTime;
});