/* ── MAIN PLAYER ── */

const audio        = document.getElementById("custom-audio-player");
const playBtn      = document.getElementById("play-pause-btn");
const playImg      = document.getElementById("play-pause-img");
const progressFill = document.getElementById("progress-bar-fill");
const progressBar  = document.querySelector(".progress-bar");
const volumeSlider = document.getElementById("volume-slider");
const muteBtn      = document.getElementById("mute-btn");
const muteIcon     = document.getElementById("mute-icon");

let lastVolume = parseFloat(volumeSlider.value);
audio.volume   = lastVolume;

playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    await audio.play().catch(err => console.log("Playback blocked:", err));
    playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    audio.pause();
    playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    muteIcon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
  } else {
    muteIcon.src = "assets/no-audio.png";
  }
});

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

const loopBtn = document.getElementById("loop-btn");

loopBtn.addEventListener("click", () => {
  audio.loop = !audio.loop;
  loopBtn.classList.toggle("active", audio.loop);
});


/* ── MIXER ── */

const rain    = document.getElementById("rain-audio");
const thunder = document.getElementById("thunder-audio");
const brown   = document.getElementById("brown-audio");
const fire    = document.getElementById("fire-audio");

rain.volume = thunder.volume = brown.volume = fire.volume = 0;

function unlockAudio(audioEl) {
  document.addEventListener("click", () => {
    audioEl.play().then(() => { audioEl.pause(); audioEl.currentTime = 0; }).catch(() => {});
  }, { once: true });
}

unlockAudio(rain);
unlockAudio(thunder);
unlockAudio(brown);
unlockAudio(fire);

function startIfNeeded(audioEl) {
  if (audioEl.paused) audioEl.play().catch(err => console.log("Blocked:", err));
}

function pauseIfSilent(audioEl) {
  if (audioEl.volume === 0 && !audioEl.paused) audioEl.pause();
}

function setupChannel(audioEl, slider, muteBtn) {
  const icon = muteBtn.querySelector("img");

  slider.addEventListener("input", () => {
    audioEl.volume = slider.value / 100;
    if (audioEl.volume > 0) {
      icon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
      startIfNeeded(audioEl);
    } else {
      icon.src = "assets/no-audio.png";
      pauseIfSilent(audioEl);
    }
  });

  muteBtn.addEventListener("click", () => {
    if (audioEl.volume > 0) {
      audioEl.dataset.lastVolume = audioEl.volume;
      audioEl.volume = 0;
      slider.value = 0;
      icon.src = "assets/no-audio.png";
      pauseIfSilent(audioEl);
    } else {
      const restore = parseFloat(audioEl.dataset.lastVolume) || 0.5;
      audioEl.volume = restore;
      slider.value = restore * 100;
      icon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
      startIfNeeded(audioEl);
    }
  });
}

setupChannel(rain,    document.getElementById("rain"),    document.getElementById("rain-mute"));
setupChannel(thunder, document.getElementById("thunder"), document.getElementById("thunder-mute"));
setupChannel(brown,   document.getElementById("brown"),   document.getElementById("brown-mute"));
setupChannel(fire,    document.getElementById("fire"),    document.getElementById("fire-mute"));