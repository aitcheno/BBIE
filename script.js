const audio = document.getElementById("custom-audio-player");

const playBtn = document.getElementById("play-pause-btn");
const playImg = document.getElementById("play-pause-img");

const progressFill = document.getElementById("progress-bar-fill");
const progressBar = document.querySelector(".progress-bar");

const volumeSlider = document.getElementById("volume-slider");
const muteBtn = document.getElementById("mute-btn");
const muteIcon = document.getElementById("mute-icon");

let lastVolume = volumeSlider.value;

/* PLAY */
playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    await audio.play().catch(err => console.log("Main audio blocked:", err));
    playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    audio.pause();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
});

/* PROGRESS */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});

/* SEEK */
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  audio.currentTime = (clickX / rect.width) * audio.duration;
});

/* VOLUME */
audio.volume = volumeSlider.value;

/* ICON */
function updateMuteIcon(audio, icon) {
  icon.src =
    audio.volume === 0
      ? "assets/no-audio.png"
      : "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
}

/* SLIDER */
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;

  if (audio.volume == 0) {
    muteIcon.src = "assets/no-audio.png";
  } else {
    muteIcon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
    lastVolume = audio.volume;
  }
});

/* MUTE */
muteBtn.addEventListener("click", () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = lastVolume || 1;
    volumeSlider.value = audio.volume;
  }
  updateMuteIcon(audio, muteIcon);
});

/* LOOP */
const loopBtn = document.getElementById("loop-btn");

loopBtn.addEventListener("click", () => {
  audio.loop = !audio.loop;
  loopBtn.classList.toggle("active", audio.loop);
});

/* ========================= */
/* MIXER */
/* ========================= */

const rain = document.getElementById("rain-audio");
const thunder = document.getElementById("thunder-audio");
const brown = document.getElementById("brown-audio");
const fire = document.getElementById("fire-audio");

const rainSlider = document.getElementById("rain");
const thunderSlider = document.getElementById("thunder");
const brownSlider = document.getElementById("brown");
const fireSlider = document.getElementById("fire");

const rainMute = document.getElementById("rain-mute");
const thunderMute = document.getElementById("thunder-mute");
const brownMute = document.getElementById("brown-mute");
const fireMute = document.getElementById("fire-mute");

/* unlock audio (required by browsers) */
function unlockAudio(audio) {
  const unlock = () => {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => {});
  };
  document.addEventListener("click", unlock, { once: true });
}

unlockAudio(rain);
unlockAudio(thunder);
unlockAudio(brown);
unlockAudio(fire);

/* start helper */
function startAudioIfNeeded(audio) {
  if (audio.paused) {
    audio.play().catch(err => console.log("Blocked:", err));
  }
}

/* SLIDERS */
rainSlider.addEventListener("input", () => {
  rain.volume = rainSlider.value / 100;
  startAudioIfNeeded(rain);
});

thunderSlider.addEventListener("input", () => {
  thunder.volume = thunderSlider.value / 100;
  startAudioIfNeeded(thunder);
});

brownSlider.addEventListener("input", () => {
  brown.volume = brownSlider.value / 100;
  startAudioIfNeeded(brown);
});

fireSlider.addEventListener("input", () => {
  fire.volume = fireSlider.value / 100;
  startAudioIfNeeded(fire);
});

/* MUTE */
function setupMute(audio, btn, slider) {
  const icon = btn.querySelector("img");

  btn.addEventListener("click", () => {
    if (audio.volume > 0) {
      audio.dataset.lastVolume = audio.volume;
      audio.volume = 0;
      slider.value = 0;
    } else {
      const restore = audio.dataset.lastVolume || 0.5;
      audio.volume = restore;
      slider.value = restore * 100;
    }

    updateMuteIcon(audio, icon);
  });
}

setupMute(rain, rainMute, rainSlider);
setupMute(thunder, thunderMute, thunderSlider);
setupMute(brown, brownMute, brownSlider);
setupMute(fire, fireMute, fireSlider);