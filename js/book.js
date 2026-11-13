
/* =========================================
   PEACE MEMORY BOOK
   RESPONSIVE BOOK, PAGE FLIPPING
   AND SAVED BOOKMARK SYSTEM
========================================= */

(function () {
    "use strict";

    let pageFlip = null;
    let bookInitialized = false;

    const BOOKMARK_KEY = "peace-bookmark";
    const PROGRESS_KEY = "peace-reading-progress";

    function initializeBook() {
        if (bookInitialized) return;

        const bookElement = document.getElementById("book");
        const previousButton = document.getElementById("previous-page");
        const nextButton = document.getElementById("next-page");
        const currentPageDisplay = document.getElementById("current-page");
        const totalPagesDisplay = document.getElementById("total-pages");
        const progressFill = document.getElementById("progress-fill");
        const bookmarkButton = document.getElementById("bookmark-button");

        if (!bookElement) {
            console.error("PEACE: Book container could not be found.");
            return;
        }

        const pages = Array.from(bookElement.querySelectorAll(".page"));

        if (pages.length === 0) {
            console.error("PEACE: No book pages were found.");
            return;
        }

        if (!window.St || !window.St.PageFlip) {
            console.error("PEACE: PageFlip library is unavailable.");
            return;
        }

        try {
            pageFlip = new St.PageFlip(bookElement, {
                width: 450,
                height: 600,
                size: "stretch",
                minWidth: 260,
                maxWidth: 900,
                minHeight: 350,
                maxHeight: 1200,
                maxShadowOpacity: 0.35,
                showCover: true,
                mobileScrollSupport: false,
                flippingTime: 1000,
                usePortrait: true,
                startPage: 0,
                autoSize: true,
                drawShadow: true,
                useMouseEvents: true
            });

            pageFlip.loadFromHTML(pages);
            bookInitialized = true;

            function getSavedBookmark() {
                try {
                    const saved = localStorage.getItem(BOOKMARK_KEY);

                    if (saved === null) return null;

                    const index = Number(saved);

                    if (
                        Number.isInteger(index) &&
                        index >= 0 &&
                        index < pages.length
                    ) {
                        return index;
                    }
                } catch (error) {
                    console.warn("PEACE: Could not read bookmark.", error);
                }

                return null;
            }

            function updateBookmarkAppearance() {
                if (!bookmarkButton) return;

                const savedPage = getSavedBookmark();

                bookmarkButton.classList.toggle(
                    "bookmark-saved",
                    savedPage !== null
                );

                bookmarkButton.setAttribute(
                    "aria-pressed",
                    savedPage !== null ? "true" : "false"
                );

                bookmarkButton.title = savedPage !== null
                    ? "Saved bookmark: page " + (savedPage + 1) + ". Click to return."
                    : "No saved bookmark";
            }

            function updatePageInformation() {
                const currentIndex = pageFlip.getCurrentPageIndex();
                const currentPage = currentIndex + 1;

                if (currentPageDisplay) {
                    currentPageDisplay.textContent = currentPage;
                }

                if (totalPagesDisplay) {
                    totalPagesDisplay.textContent = pages.length;
                }

                if (progressFill) {
                    progressFill.style.width =
                        (currentPage / pages.length) * 100 + "%";
                }

                if (previousButton) {
                    previousButton.disabled = currentIndex === 0;
                }

                if (nextButton) {
                    nextButton.disabled = currentIndex === pages.length - 1;
                }

                try {
                    localStorage.setItem(PROGRESS_KEY, String(currentIndex));
                } catch (error) {
                    console.warn("PEACE: Could not save reading progress.", error);
                }
            }

            pageFlip.on("flip", updatePageInformation);

            if (previousButton) {
                previousButton.addEventListener("click", function () {
                    pageFlip.flipPrev();
                });
            }

            if (nextButton) {
                nextButton.addEventListener("click", function () {
                    pageFlip.flipNext();
                });
            }

            if (bookmarkButton) {
                bookmarkButton.addEventListener("click", function () {
                    const currentIndex = pageFlip.getCurrentPageIndex();
                    const savedPage = getSavedBookmark();

                    if (savedPage === currentIndex) {
                        // Clicking the bookmark while already on
                        // the saved page confirms the saved position.
                        bookmarkButton.classList.remove("bookmark-pop");
                        void bookmarkButton.offsetWidth;
                        bookmarkButton.classList.add("bookmark-pop");
                        return;
                    }

                    if (savedPage !== null) {
                        // An existing bookmark is available:
                        // return to that saved page.
                        pageFlip.turnToPage(savedPage);
                    } else {
                        // No bookmark exists yet:
                        // save the current page.
                        try {
                            localStorage.setItem(
                                BOOKMARK_KEY,
                                String(currentIndex)
                            );

                            updateBookmarkAppearance();

                            bookmarkButton.classList.remove("bookmark-pop");
                            void bookmarkButton.offsetWidth;
                            bookmarkButton.classList.add("bookmark-pop");
                        } catch (error) {
                            console.error("PEACE: Could not save bookmark.", error);
                            alert("Your bookmark could not be saved in this browser.");
                        }
                    }
                });
            }

            window.addEventListener("peace:go-to-page", function (event) {
                const pageIndex = event.detail?.pageIndex;

                if (
                    Number.isInteger(pageIndex) &&
                    pageIndex >= 0 &&
                    pageIndex < pages.length
                ) {
                    pageFlip.turnToPage(pageIndex);
                }
            });

            updatePageInformation();
            updateBookmarkAppearance();

            console.log(
                "PEACE: Book initialized with " + pages.length + " pages."
            );

        } catch (error) {
            console.error("PEACE: Could not initialize the book.", error);
        }
    }

    window.addEventListener("peace:book-opened", initializeBook);

})();
