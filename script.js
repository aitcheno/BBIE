// Get elements
const video = document.getElementById("custom-video-player");
const playBtn = document.getElementById("play-pause-btn");
const playImg = document.getElementById("play-pause-img");
const progressFill = document.getElementById("progress-bar-fill");
const progressBar = document.querySelector(".progress-bar");

function togglePlayPause() {
  if (video.paused) {
    video.play();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    video.pause();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

video.addEventListener("timeupdate", () => {
  const progress = (video.currentTime / video.duration) * 100;
  progressFill.style.width = progress + "%";
});

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;

  const newTime = (clickX / width) * video.duration;
  video.currentTime = newTime;
});

const progressHandle = document.getElementById("progress-handle");

// Show and move around while hovering
progressBar.addEventListener("mousemove", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const x = e.clientX - rect.left;

  progressHandle.style.left = x + "px";
  progressHandle.style.opacity = "1";
});

// Disappear when not hovering
progressBar.addEventListener("mouseleave", () => {
  progressHandle.style.opacity = "0";
});