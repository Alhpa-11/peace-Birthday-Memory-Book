
/* =========================================
   PEACE MEMORY BOOK
   PASSWORD SYSTEM
========================================= */

(function () {
    "use strict";

    const CORRECT_PASSWORD = "peace";

    function initializePassword() {
        const passwordForm = document.getElementById("password-form");
        const passwordInput = document.getElementById("book-password");
        const passwordError = document.getElementById("password-error");

        if (!passwordForm || !passwordInput || !passwordError) {
            console.error("PEACE: Password elements could not be found.");
            return;
        }

        function showError(message) {
            passwordError.textContent = message;

            passwordError.hidden = false;
            passwordError.style.display = "block";
            passwordError.style.visibility = "visible";

            passwordError.setAttribute("role", "alert");
            passwordError.setAttribute("aria-live", "assertive");
        }

        function clearError() {
            passwordError.textContent = "";
            passwordError.hidden = true;
            passwordError.style.display = "none";
        }

        passwordForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const enteredPassword = passwordInput.value.trim();

            if (enteredPassword === CORRECT_PASSWORD) {
                clearError();
                passwordInput.value = "";

                window.dispatchEvent(
                    new CustomEvent("peace:password-success")
                );
            } else {
                showError(
                    "Incorrect password. Please try again."
                );

                passwordInput.value = "";
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener("input", clearError);

        clearError();

        console.log("PEACE: Password system initialized.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializePassword);
    } else {
        initializePassword();
    }

})();
