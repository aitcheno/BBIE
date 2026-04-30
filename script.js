/*
This file is divided up into three main sections:
1. MAIN PLAYER - controls for the main media player (the ambient track)
2. MIXER - The soundscape mixing desk (My added feature)
3. NAV FUNCTIONS + GLOW - scroll tracking that highlights each nav link and adds a glow surrounding it. I wanted to keep the website minimal but not differ from the original code design, so this is how I balanced that
*/




/* MAIN PLAYER ----- Controls play/pause, progress bar, volume, mute, and loop for the primary ambient track */


/*
My grab references for every element needed by the player
*/
const audio        = document.getElementById("custom-audio-player");  // audio element
const playBtn      = document.getElementById("play-pause-btn");        // play pause button
const playImg      = document.getElementById("play-pause-img");        // play pause icon
const progressFill = document.getElementById("progress-bar-fill");     // filled progress bar
const progressBar  = document.querySelector(".progress-bar");           // progress bar
const volumeSlider = document.getElementById("volume-slider");         // volume slider
const muteBtn      = document.getElementById("mute-btn");              // mute button
const muteIcon     = document.getElementById("mute-icon");             // mute icon

/*
  "lastVolume" remembers what the volume was before muting it can go back to that level when unmuted
  We read the slider's starting value (0.8) and apply it to the audio element
  Reading sliders starting value (0.8) and applying it to the audio element
  right away so they are in sync before the user changes anything
*/
let lastVolume = parseFloat(volumeSlider.value);  // parseFloat converts the "0.8" string to 0.8 number
audio.volume   = lastVolume;


/* PLAY / PAUSE */

/*
  audio.play() can fail with modern browsers. 
  Using async and await mitigates this
  Source: https://developer.chrome.com/blog/autoplay/ 
*/
playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    // Tries to start playback. Logs a message if blocked. I was having problems in the browser but not the preview so this helped know if something wasn't working
    await audio.play().catch(err => console.log("Playback blocked:", err));

    // Changes icon visual to pause so user knows its now playing
    playImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    audio.pause();
    // Swaps back to the play icon
    playImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
});


/*PROGRESS BAR — AUTO-UPDATING*/

/*
  "timeupdate" fires as the audio plays. 
  Math to turn the current time divided by duration into a perentage 
  Percentage determines the fill width on the bar
  Auto updates!
*/
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;  // bails out if time duration isn't known yet or hasn't loaded. safety measure because you can't divide by zero 
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = percent + "%";
});


/*PROGRESS BAR — CLICKING/SEEKING */

/*
  User clicks on the progress bar, and how far along the bar the click landed 
  is calculated as a fraction of the bars total width

  getBoundingClientRect() gives bar's position
  e.clientX is the position of the click 
  Subtracting rect.left gives the offset from the bar's left edge
  Dividing by rect.width converts that to a 0–1 fraction
  Multiplying by audio.duration converts it to a time in seconds

  Really enjoyed the maths behind these
*/
progressBar.addEventListener("click", (e) => {
  const rect     = progressBar.getBoundingClientRect();  // bar's position

  const fraction = (e.clientX - rect.left) / rect.width; // 0.0 at very left, 1.0 at very right
  audio.currentTime = fraction * audio.duration;          // Seeks to the clicked point
});


/* VOLUME SLIDER */

/*
  Input fires continuously as the slider is being moved wheras using change would only fire once releasing left click
  Updates volume keeping lastVolume in sync so mute/unmute works
  Made it so when the volume is all the way down, the icon swaps to the muted one
*/
volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);  // slider value is a string so changing

  if (audio.volume > 0) {
    lastVolume = audio.volume;  // lastVolume memorising level for when muted
    muteIcon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
  } else {
    muteIcon.src = "assets/no-audio.png";  // Shows muted icon when volume is down all the way. Have my local file as backup
  }
});


/*MUTE BUTTON*/

/*
Mute button works as a toggle:
- If currently unmuted, set it to 0, save the lastVolume, and change to muted icon
- If currently muted, restore the lastVolume or turn on if it's undefined, change to unmuted icon

Updating volumeSlider.value manually so the slider position stays in sync with the real audio volume. It wouldn't be in sync if only the audio.volume changed
*/
muteBtn.addEventListener("click", () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;       // save lastVolume before muting
    audio.volume = 0;
    volumeSlider.value = 0;          // Move slider to the left
    muteIcon.src = "assets/no-audio.png";
  } else {
    audio.volume = lastVolume || 1;  // restores and turns on if it is undefined
    volumeSlider.value = audio.volume;
    muteIcon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
  }
});


/*LOOP BUTTON*/

/*
  Toggling audio.loop with !audio.loop flips audio.loop with each click. Turning looping on and off
  classList.toggle("active", audio.loop) adds the class if loop is on
  and removes it if loop is off
*/
const loopBtn = document.getElementById("loop-btn");

loopBtn.addEventListener("click", () => {
  audio.loop = !audio.loop;                               // Flips the loop state
  loopBtn.classList.toggle("active", audio.loop);        // reflects state in CSS
});


/* SECTION 2 — SOUNDSCAPE MIXER  (My extra interactive feature)
   The study/relaxation context was the motivation for adding this
   feature. I chose the sounds of common calming sounds I found myself on similar mixer apps.
  A mixer lets each user personalise their soundscape rather than just having the unchangeable ambient track.
  There is a broader appeal for users due to the customisation

   Each of the four channels (Rain, Thunder, Brown noise, Fire) has:
  - A vertical fader controlling volume 0–100
  - A mute/unmute button that stores and restores the previous volume just like the media player
  - Smart play/pause logic: tracks only play when their volume is greater than 0 which saves resources making the players run more smoothly
*/

/*
  Grabs the audio elements. Loop is already set in html
*/
const rain    = document.getElementById("rain-audio");
const thunder = document.getElementById("thunder-audio");
const brown   = document.getElementById("brown-audio");
const fire    = document.getElementById("fire-audio");

/*
  All volumes set to zero to start with so nothing plays to start which would be pretty irritating
*/
rain.volume = thunder.volume = brown.volume = fire.volume = 0;


/* OTHER FUNCTIONS */

/*
  startIfNeeded: only calls .play() if the track is currently paused. There'd be an error if play was called when it was already playing
*/
function startIfNeeded(audioEl) {
  if (audioEl.paused) {
    audioEl.play().catch(err => console.log("Playback blocked:", err));
  }
}

/*
  pauseIfSilent: pauses track when it's muted to save resources
*/
function pauseIfSilent(audioEl) {
  if (audioEl.volume === 0 && !audioEl.paused) {
    audioEl.pause();
  }
}


/* ── setupChannel — REUSABLE CHANNEL LOGIC*/

/*
  Using the DRY principle, I found a way to make the code shorter here

  Rather than writing separate event listeners for every channel, I used a function that accepts audio element, slider and mute button as arguments

  audioEl is the <audio> element for the channel
  slider is the input type="range"> fader for the channel
  muteBtn is the mute button for the channel
*/

function setupChannel(audioEl, slider, muteBtn) {
  // Find the image inside the mute button so the icon can be swapped
  const icon = muteBtn.querySelector("img");

  /* FADER INPUT
    Same concept for real time volume control as on the media player BUT
    HTMLMediaElement.volume expects 0.0-1.0 range instead of 0-100 so it is divided by 100*/
  slider.addEventListener("input", () => {
    audioEl.volume = slider.value / 100;  // convert 0–100 to 0-1

    if (audioEl.volume > 0) {
      // Volume on, make sure volume on icon is shown and track is running
      icon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
      startIfNeeded(audioEl);
    } else {
      // Volume is zero, show mute icon and turn off the track
      icon.src = "assets/no-audio.png";
      pauseIfSilent(audioEl);
    }
  });

  /* MUTE BUTTON
     Toggle, muting if on and restoring to volume it was at, if muted
     Value is put onto the audio element itself so I don't have to write it out for each channel: DRY principle
     If no lastVolume is saved, it defaults to half volume so it's semsibly not too loud but also obviously on */
  muteBtn.addEventListener("click", () => {
    if (audioEl.volume > 0) {
      // If Volume is greater than 0, mute it
      audioEl.dataset.lastVolume = audioEl.volume;  // Saves current level
      audioEl.volume = 0;
      slider.value   = 0;                           // Moves the slider to 0
      icon.src = "assets/no-audio.png";             // Changes icon
      pauseIfSilent(audioEl);                       // Turns off audio to save resources
    } else {
      // If muted, restore to saved volume
      const restore = parseFloat(audioEl.dataset.lastVolume) || 0.5; // Default to 50% if nothing saved
      audioEl.volume = restore;
      slider.value   = restore * 100;               // Converts back to 0-100
      icon.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v1.png";
      startIfNeeded(audioEl);                       // Resumes playing
    }
  });
}


/*
  Runs setupChannel once for each of the tracks, passing in the
  audio element, fader, and mute button that belong to that channel.
*/
setupChannel(rain,    document.getElementById("rain"),    document.getElementById("rain-mute"));
setupChannel(thunder, document.getElementById("thunder"), document.getElementById("thunder-mute"));
setupChannel(brown,   document.getElementById("brown"),   document.getElementById("brown-mute"));
setupChannel(fire,    document.getElementById("fire"),    document.getElementById("fire-mute"));


/* SECTION 3 — NAV ACTIVE STATE + SECTION GLOW 
When clicking on navs making them glow and the sections being referred to glow */
/*
  Grabs all nav links and the four sections they point to
  In the same order so index 0 = Home, 1 = Player, etc.
*/
const navLinks = document.querySelectorAll("nav a");
const sections = [
  document.getElementById("home"),
  document.getElementById("player"),
  document.getElementById("mixer"),
  document.getElementById("about")
];

/*
  When called with its index number, the function:
  - Removes "active" from all nav links then adds it to the right one
  - Removes "section-active" from all sections then adds it to the right one
  Home is skipped because it's not a card like the rest
*/
function setActiveLink(index) {
  navLinks.forEach(l => l.classList.remove("active"));
  if (navLinks[index]) navLinks[index].classList.add("active");

  sections.forEach(s => { if (s) s.classList.remove("section-active"); });
  if (sections[index]) sections[index].classList.add("section-active");
}

/*
  Clicking a nav link highlights it 
*/
navLinks.forEach((link, i) => {
  link.addEventListener("click", () => setActiveLink(i));
});

/*
  IntersectionObserver watches the sections and fires when one becomes visible.
  threshold 0.4 means 40% of the section must be on screen before it triggers 
  which is cool you're able to do. This stops it from flickering when two sections are near the edge at once.
  Source: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
*/
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = sections.indexOf(entry.target);  // find which section
      if (index !== -1) setActiveLink(index);        // add the glow
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => { if (section) observer.observe(section); });

// Automatically highlighting home as default when opening the website
setActiveLink(0);
