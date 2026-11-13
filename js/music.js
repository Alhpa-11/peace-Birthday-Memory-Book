
/* =========================================
   PEACE MEMORY BOOK
   BACKGROUND MUSIC PLAYER
========================================= */

(function () {
    "use strict";

    const songs = [
        { title: "Beautiful Memories", file: "song-1.mp3" },
        { title: "A Special Melody", file: "song-2.mp3" },
        { title: "Sweet Moments", file: "song-3.mp3" },
        { title: "Forever Remembered", file: "song-4.mp3" },
        { title: "A Song for You", file: "song-5.mp3" },
        { title: "Golden Memories", file: "song-6.mp3" },
        { title: "Our Little World", file: "song-7.mp3" }
    ];

    let currentSongIndex = 0;
    let playerInitialized = false;

    function initializeMusicPlayer() {
        if (playerInitialized) return;

        const audio = document.getElementById("background-audio");
        const playButton = document.getElementById("music-toggle");
        const previousButton = document.getElementById("previous-song");
        const nextButton = document.getElementById("next-song");
        const volumeControl = document.getElementById("music-volume");
        const songTitle = document.getElementById("song-title");
        const musicPlayer = document.getElementById("music-player");

        if (
            !audio ||
            !playButton ||
            !previousButton ||
            !nextButton ||
            !volumeControl ||
            !songTitle
        ) {
            console.error("PEACE: Music player elements are missing.");
            return;
        }

        playerInitialized = true;

        currentSongIndex = Math.floor(Math.random() * songs.length);

        function updateSongTitle() {
            songTitle.textContent = songs[currentSongIndex].title;
        }

        function updatePlayButton(isPlaying) {
            playButton.textContent = isPlaying ? "❚❚" : "▶";

            playButton.setAttribute(
                "aria-label",
                isPlaying ? "Pause music" : "Play music"
            );

            if (musicPlayer) {
                musicPlayer.classList.toggle("playing", isPlaying);
            }
        }

        function showMusicError(message) {
            let errorMessage = document.getElementById("music-error");

            if (!errorMessage) {
                errorMessage = document.createElement("p");
                errorMessage.id = "music-error";
                errorMessage.className = "music-error";
                errorMessage.setAttribute("role", "status");
                errorMessage.setAttribute("aria-live", "polite");

                musicPlayer?.appendChild(errorMessage);
            }

            errorMessage.textContent = message;
        }

        function clearMusicError() {
            const errorMessage = document.getElementById("music-error");

            if (errorMessage) {
                errorMessage.textContent = "";
            }
        }

        function loadSong(index) {
            currentSongIndex =
                (index + songs.length) % songs.length;

            audio.pause();

            audio.src =
                "media/music/" + songs[currentSongIndex].file;

            audio.load();

            updateSongTitle();
            updatePlayButton(false);
            clearMusicError();
        }

        async function playMusic() {
            try {
                await audio.play();
                clearMusicError();
            } catch (error) {
                updatePlayButton(false);

                showMusicError(
                    "Music could not play. Add the music file or check its location."
                );

                console.warn("PEACE: Music playback failed.", error);
            }
        }

        function pauseMusic() {
            audio.pause();
        }

        function nextSong() {
            loadSong(currentSongIndex + 1);
            playMusic();
        }

        function previousSong() {
            loadSong(currentSongIndex - 1);
            playMusic();
        }

        playButton.addEventListener("click", function () {
            if (audio.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });

        nextButton.addEventListener("click", nextSong);
        previousButton.addEventListener("click", previousSong);

        audio.volume = Math.min(
            1,
            Math.max(0, Number(volumeControl.value))
        );

        volumeControl.addEventListener("input", function () {
            audio.volume = Math.min(
                1,
                Math.max(0, Number(volumeControl.value))
            );
        });

        audio.addEventListener("ended", nextSong);

        audio.addEventListener("play", function () {
            updatePlayButton(true);
        });

        audio.addEventListener("pause", function () {
            updatePlayButton(false);
        });

        audio.addEventListener("error", function () {
            updatePlayButton(false);

            showMusicError(
                "This music file could not be found or loaded."
            );
        });

        loadSong(currentSongIndex);

        console.log("PEACE: Music player initialized with 7 song slots.");
    }

    window.addEventListener("peace:book-opened", initializeMusicPlayer);

})();
