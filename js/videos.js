
/* =========================================
   PEACE MEMORY BOOK
   VIDEO GALLERY SYSTEM
========================================= */

(function () {
    "use strict";

    let videoViewer = null;
    let videoElement = null;

    function createVideoViewer() {
        if (videoViewer) return;

        videoViewer = document.createElement("div");
        videoViewer.id = "peace-video-viewer";
        videoViewer.className = "video-viewer";
        videoViewer.hidden = true;

        videoViewer.innerHTML = `
            <div class="video-viewer-content">
                <button
                    type="button"
                    class="video-close-button"
                    aria-label="Close video"
                >
                    &times;
                </button>

                <video
                    class="video-viewer-player"
                    controls
                    playsinline
                    preload="metadata"
                ></video>

                <p class="video-error-message" role="status" aria-live="polite"></p>
            </div>
        `;

        document.body.appendChild(videoViewer);

        videoElement = videoViewer.querySelector("video");

        const closeButton = videoViewer.querySelector(".video-close-button");

        closeButton.addEventListener("click", closeVideo);

        videoViewer.addEventListener("click", (event) => {
            if (event.target === videoViewer) {
                closeVideo();
            }
        });

        videoElement.addEventListener("ended", closeVideo);

        videoElement.addEventListener("error", () => {
            const errorMessage = videoViewer.querySelector(
                ".video-error-message"
            );

            errorMessage.textContent =
                "This video could not be loaded. Please check the video file path.";
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !videoViewer.hidden) {
                closeVideo();
            }
        });
    }

    function openVideo(videoPath) {
        if (!videoPath) return;

        createVideoViewer();

        const errorMessage = videoViewer.querySelector(
            ".video-error-message"
        );

        errorMessage.textContent = "";

        videoElement.pause();
        videoElement.removeAttribute("src");
        videoElement.load();

        videoElement.src = videoPath;

        videoViewer.hidden = false;
        document.body.classList.add("video-viewer-open");

        videoElement.load();

        const playRequest = videoElement.play();

        if (playRequest && typeof playRequest.catch === "function") {
            playRequest.catch(() => {
                // The viewer remains open so the user can press Play manually.
            });
        }
    }

    function closeVideo() {
        if (!videoViewer || videoViewer.hidden) return;

        videoElement.pause();
        videoElement.removeAttribute("src");
        videoElement.load();

        videoViewer.hidden = true;
        document.body.classList.remove("video-viewer-open");
    }

    function initializeVideoGallery() {
        const videoItems = document.querySelectorAll("[data-video]");

        videoItems.forEach((item) => {
            if (item.dataset.videoInitialized === "true") return;

            item.dataset.videoInitialized = "true";

            item.addEventListener("click", () => {
                openVideo(item.dataset.video);
            });

            item.addEventListener("keydown", (event) => {
                if (
                    (event.key === "Enter" || event.key === " ") &&
                    item.tagName !== "BUTTON"
                ) {
                    event.preventDefault();
                    openVideo(item.dataset.video);
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeVideoGallery);
    } else {
        initializeVideoGallery();
    }

})();
