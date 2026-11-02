
const songs = [
    {
        title: "My First Song",
        artist: "Pixabay Music",
        source: "songs/song1.mp3"
    },
    {
        title: "My Second Song",
        artist: "Pixabay Music",
        source: "songs/song2.mp3"
    },
    {
        title: "My Third Song",
        artist: "Pixabay Music",
        source: "songs/song3.mp3"
    }
];

// Get elements from HTML
const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const volumeBar = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const status = document.getElementById("status");

let currentSongIndex = 0;
let isPlaying = false;

// Format time
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Display playlist
function renderPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = "playlist-item";

        if (index === currentSongIndex) {
            item.classList.add("active");
        }

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = song.title;

        const artist = document.createElement("p");
        artist.textContent = song.artist;

        details.appendChild(title);
        details.appendChild(artist);

        const number = document.createElement("span");
        number.textContent = index + 1;

        item.appendChild(details);
        item.appendChild(number);

        item.addEventListener("click", () => {
            selectSong(index);
        });

        playlist.appendChild(item);
    });
}

// Load song
function loadSong(index) {
    currentSongIndex = index;

    const song = songs[currentSongIndex];

    audio.pause();
    audio.src = song.source;
    audio.load();

    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;

    progressBar.value = 0;
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    playBtn.textContent = "▶";
    status.textContent = "Ready to play";
    isPlaying = false;

    renderPlaylist();
}

// Play song
async function playSong() {
    try {
        await audio.play();

        isPlaying = true;
        playBtn.textContent = "❚❚";
        status.textContent = "Now playing";

    } catch (error) {
        isPlaying = false;
        playBtn.textContent = "▶";
        status.textContent = "Unable to play. Check the audio file.";

        console.error("Playback error:", error);
    }
}

// Pause song
function pauseSong() {
    audio.pause();

    isPlaying = false;
    playBtn.textContent = "▶";
    status.textContent = "Paused";
}

// Play/Pause button
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Next song
function nextSong() {
    const nextIndex = (currentSongIndex + 1) % songs.length;

    loadSong(nextIndex);
    playSong();
}

nextBtn.addEventListener("click", nextSong);

// Previous song
function previousSong() {
    const previousIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;

    loadSong(previousIndex);
    playSong();
}

prevBtn.addEventListener("click", previousSong);

// Update progress
audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progressBar.value =
            (audio.currentTime / audio.duration) * 100;
    }

    currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

// Show duration
audio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(audio.duration);
});

// Seek through song
progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (progressBar.value / 100) * audio.duration;
    }
});

// Volume control
volumeBar.addEventListener("input", () => {
    audio.volume = Number(volumeBar.value);
});

// Autoplay next song
audio.addEventListener("ended", nextSong);

// Audio loading error
audio.addEventListener("error", () => {
    isPlaying = false;
    playBtn.textContent = "▶";
    status.textContent = "Audio file could not be loaded.";

    console.error("Audio error:", audio.error);
});

// Initialize player
audio.volume = 0.7;
loadSong(0);
