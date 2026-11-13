
/* =========================================
   PEACE MEMORY BOOK
   VOICE NOTE PLAYER
========================================= */

(function () {
    "use strict";

    function initializeVoiceNotes() {
        const voiceNotes = document.querySelectorAll(".voice-placeholder");

        if (!voiceNotes.length) return;

        let activeAudio = null;

        voiceNotes.forEach((note) => {
            // Prevent duplicate player creation
            if (note.dataset.playerInitialized === "true") return;
            note.dataset.playerInitialized = "true";

            const audioPath = note.dataset.audio;

            // Keep empty placeholders ready for future audio files
            if (!audioPath) return;

            const audio = new Audio(audioPath);
            audio.preload = "metadata";

            const playButton = document.createElement("button");
            playButton.type = "button";
            playButton.className = "voice-play-button";
            playButton.textContent = "Play";
            playButton.setAttribute("aria-label", "Play voice note");

            const progress = document.createElement("input");
            progress.type = "range";
            progress.className = "voice-progress";
            progress.min = "0";
            progress.max = "100";
            progress.value = "0";
            progress.disabled = true;
            progress.setAttribute("aria-label", "Voice note progress");

            const timeDisplay = document.createElement("span");
            timeDisplay.className = "voice-time";
            timeDisplay.textContent = "0:00 / 0:00";

            const status = document.createElement("span");
            status.className = "voice-status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");

            const player = document.createElement("div");
            player.className = "voice-player";

            player.append(playButton, progress, timeDisplay, status);
            note.appendChild(player);

            function formatTime(seconds) {
                if (!Number.isFinite(seconds)) return "0:00";

                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);

                return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
            }

            function updateProgress() {
                const duration = audio.duration;

                if (!Number.isFinite(duration) || duration <= 0) return;

                const percentage = (audio.currentTime / duration) * 100;

                progress.value = String(percentage);
                timeDisplay.textContent =
                    `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
            }

            function resetPlayer() {
                playButton.textContent = "Play";
                playButton.setAttribute("aria-label", "Play voice note");
                progress.value = "0";
                timeDisplay.textContent =
                    `0:00 / ${formatTime(audio.duration)}`;
            }

            playButton.addEventListener("click", async () => {
                if (audio.paused) {
                    // Stop any other voice note currently playing
                    if (activeAudio && activeAudio !== audio) {
                        activeAudio.pause();
                        activeAudio.currentTime = 0;

                        const previousNote = activeAudio._voiceNote;
                        if (previousNote) {
                            previousNote.resetPlayer();
                        }
                    }

                    activeAudio = audio;

                    try {
                        await audio.play();
                    } catch (error) {
                        status.textContent =
                            "Unable to play this voice note. Check the audio file.";
                        playButton.textContent = "Play";
                        activeAudio = null;
                    }
                } else {
                    audio.pause();
                }
            });

            audio.addEventListener("play", () => {
                playButton.textContent = "Pause";
                playButton.setAttribute("aria-label", "Pause voice note");
                status.textContent = "Playing";
            });

            audio.addEventListener("pause", () => {
                playButton.textContent = "Play";
                playButton.setAttribute("aria-label", "Play voice note");

                if (!audio.ended) {
                    status.textContent = "Paused";
                }
            });

            audio.addEventListener("loadedmetadata", () => {
                progress.disabled = false;
                timeDisplay.textContent =
                    `0:00 / ${formatTime(audio.duration)}`;
            });

            audio.addEventListener("timeupdate", updateProgress);

            progress.addEventListener("input", () => {
                if (!Number.isFinite(audio.duration)) return;

                audio.currentTime =
                    (Number(progress.value) / 100) * audio.duration;

                updateProgress();
            });

            audio.addEventListener("ended", () => {
                resetPlayer();
                status.textContent = "Finished";

                if (activeAudio === audio) {
                    activeAudio = null;
                }
            });

            audio.addEventListener("error", () => {
                status.textContent =
                    "Audio file could not be loaded. Check its file path.";
                playButton.disabled = true;
                progress.disabled = true;

                if (activeAudio === audio) {
                    activeAudio = null;
                }
            });

            // Allow another player to reset this one
            audio._voiceNote = {
                resetPlayer,
            };
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeVoiceNotes);
    } else {
        initializeVoiceNotes();
    }
})();
