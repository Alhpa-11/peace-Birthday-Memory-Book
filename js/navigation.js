
/* =========================================
   PEACE MEMORY BOOK
   CONTENTS AND SECRET ENVELOPE
========================================= */

(function () {
    "use strict";

    function initializeNavigation() {
        const contentsButton = document.getElementById("contents-button");
        const contentsPanel = document.getElementById("contents-panel");
        const closeContentsButton = document.getElementById("close-contents");
        const contentsList = document.getElementById("contents-list");

        const secretEnvelope = document.getElementById("secret-envelope");
        const secretLetter = document.getElementById("secret-letter");

        // CONTENTS MENU
        if (contentsButton && contentsPanel) {
            contentsButton.addEventListener("click", function () {
                contentsPanel.hidden = false;
                contentsPanel.setAttribute("aria-hidden", "false");
            });
        }

        if (closeContentsButton && contentsPanel) {
            closeContentsButton.addEventListener("click", function () {
                contentsPanel.hidden = true;
                contentsPanel.setAttribute("aria-hidden", "true");
            });
        }

        // Create contents links from the book pages.
        if (contentsList) {
            const pages = document.querySelectorAll("#book .page");

            pages.forEach(function (page, index) {
                const heading = page.querySelector("h1, h2, h3");

                const pageTitle = heading
                    ? heading.textContent.trim()
                    : "Page " + (index + 1);

                const item = document.createElement("button");

                item.type = "button";
                item.className = "contents-link";
                item.textContent = (index + 1) + ". " + pageTitle;

                item.addEventListener("click", function () {
                    if (
                        window.St &&
                        window.St.PageFlip &&
                        document.getElementById("book")
                    ) {
                        // The book instance is managed by book.js.
                        window.dispatchEvent(
                            new CustomEvent("peace:go-to-page", {
                                detail: { pageIndex: index }
                            })
                        );
                    }

                    contentsPanel.hidden = true;
                    contentsPanel.setAttribute("aria-hidden", "true");
                });

                contentsList.appendChild(item);
            });
        }

        // SECRET ENVELOPE
        if (secretEnvelope) {
            secretEnvelope.addEventListener("click", function () {
                const isOpen = secretEnvelope.classList.toggle("open");

                secretEnvelope.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

                if (secretLetter) {
                    secretLetter.hidden = !isOpen;
                }
            });
        }

        console.log("PEACE: Navigation initialized.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeNavigation);
    } else {
        initializeNavigation();
    }
})();
