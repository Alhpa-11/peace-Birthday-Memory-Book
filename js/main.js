
/* =========================================
   PEACE MEMORY BOOK
   MAIN APPLICATION
========================================= */

(function () {
    "use strict";

    function initializeApp() {
        const loadingScreen = document.getElementById("loading-screen");
        const coverScreen = document.getElementById("cover-screen");
        const passwordScreen = document.getElementById("password-screen");
        const bookScreen = document.getElementById("book-screen");

        const openGiftButton = document.getElementById("open-gift-button");
        const backButton = document.getElementById("back-to-cover-button");

        // Check that all required elements exist.
        if (
            !coverScreen ||
            !passwordScreen ||
            !bookScreen ||
            !openGiftButton ||
            !backButton
        ) {
            console.error("PEACE: Some required screen elements are missing.");
            return;
        }

        // Show one screen and hide the others.
        function showScreen(screenToShow) {
            const screens = [
                coverScreen,
                passwordScreen,
                bookScreen
            ];

            screens.forEach(function (screen) {
                const isActive = screen === screenToShow;

                screen.hidden = !isActive;
                screen.setAttribute("aria-hidden", String(!isActive));
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        // Start with the birthday cover.
        showScreen(coverScreen);

        // Hide the loading screen.
        if (loadingScreen) {
            loadingScreen.hidden = true;
        }

        // Open the password screen.
        openGiftButton.addEventListener("click", function () {
            showScreen(passwordScreen);
        });

        // Return to the birthday cover.
        backButton.addEventListener("click", function () {
            showScreen(coverScreen);
        });

        // Open the book after the correct password is entered.
        window.addEventListener("peace:password-success", function () {
            showScreen(bookScreen);

            // Notify other parts of the application.
            window.dispatchEvent(
                new CustomEvent("peace:book-opened")
            );
        });

        console.log("PEACE memory book initialized successfully.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApp);
    } else {
        initializeApp();
    }
})();
