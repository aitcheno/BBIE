console.log("JS loaded");

// Get elements
const video = document.getElementById("custom-video-player");
const playBtn = document.getElementById("play-pause-btn");
const playImg = document.getElementById("play-pause-img");
const progressFill = document.getElementById("progress-bar-fill");
const progressBar = document.querySelector(".progress-bar");

// Play / Pause  with debug
playBtn.addEventListener("click", async () => {
  console.log("Play button clicked");

  try {
    if (video.paused) {
      await video.play();
      console.log("Video is playing");
      playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
    } else {
      video.pause();
      console.log("Video paused");
      playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
    }
  } catch (err) {
    console.error("Play failed:", err);
  }
});

// Progress Bar
video.addEventListener("timeupdate", () => {
  const progress = (video.currentTime / video.duration) * 100;
  progressFill.style.width = progress + "%";
});

// Seeking
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;

  video.currentTime = (clickX / rect.width) * video.duration;
});