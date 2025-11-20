// =================== JS for all pages ===================
// =======================================================
//  WINDOW ONLOAD 
window.onload = function () {

    // ===================================================
    // 1) BACK TO TOP BUTTON  (Home Page)
    var backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {

        
        window.onscroll = function () {
            if (document.documentElement.scrollTop > 300 ||
                document.body.scrollTop > 300) {

                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        };

        backToTopBtn.onclick = function () {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };
    }



    // ===================================================
    // 2) REAL-TIME CLOCK (Home Page)
    var clock = document.getElementById("clock");

    if (clock) {

        function updateClock() {
            var now = new Date();
            clock.textContent = now.toLocaleTimeString();
        }

        setInterval(updateClock, 1000);
        updateClock();
    }




    // ===================================================
    // 3) SERVICES PAGE — RANDOM ORDER + SORT + SEARCH
    var grid = document.getElementById("servicesGrid"); 

    if (grid) {

        // ---------------------------
        // Convert HTMLCollection to Array manually 
        // ---------------------------
        var nodeList = grid.getElementsByClassName("service-card");
        var cards = [];
        for (var i = 0; i < nodeList.length; i++) {
            cards.push(nodeList[i]);
        }

        // ---------------------------
        // Random Shuffle
        // ---------------------------
        shuffle(cards);
        render(cards, grid);

        // ---------------------------
        // Sorting
        // ---------------------------
        var sortSelect = document.getElementById("sort-services");

        if (sortSelect) {
            sortSelect.onchange = function () {
                var v = sortSelect.value;

                if (v === "price-low-high") {
                    cards.sort(function (a, b) {
                        return parseInt(a.getAttribute("data-price")) -
                               parseInt(b.getAttribute("data-price"));
                    });
                }
                else if (v === "price-high-low") {
                    cards.sort(function (a, b) {
                        return parseInt(b.getAttribute("data-price")) -
                               parseInt(a.getAttribute("data-price"));
                    });
                }
                else if (v === "name-az") {
                    cards.sort(function (a, b) {
                        var A = a.getAttribute("data-name").toLowerCase();
                        var B = b.getAttribute("data-name").toLowerCase();
                        if (A < B) return -1;
                        if (A > B) return 1;
                        return 0;
                    });
                }
                else if (v === "name-za") {
                    cards.sort(function (a, b) {
                        var A = a.getAttribute("data-name").toLowerCase();
                        var B = b.getAttribute("data-name").toLowerCase();
                        if (A > B) return -1;
                        if (A < B) return 1;
                        return 0;
                    });
                }

                render(cards, grid);
            };
        }

        // ---------------------------
        // Search (basic DOM only)
        // ---------------------------
        var searchInput = document.getElementById("service-search");

        if (searchInput) {

            searchInput.onkeyup = function () {
                var text = searchInput.value.toLowerCase();

                for (var i = 0; i < cards.length; i++) {

                    var name = cards[i].getAttribute("data-name").toLowerCase();

                    var desc = "";
                    var descEl = cards[i].getElementsByClassName("desc")[0];
                    if (descEl) desc = descEl.textContent.toLowerCase();

                    if (name.indexOf(text) !== -1 || desc.indexOf(text) !== -1) {
                        cards[i].style.display = "";
                    } else {
                        cards[i].style.display = "none";
                    }
                }
            };
        }
    }
};



// =======================================================
// Helper 1 — Shuffle (Arrays)
function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}



// =======================================================
// Helper 2 — Render cards into the grid
function render(cards, grid) {
    grid.innerHTML = "";
    for (var i = 0; i < cards.length; i++) {
        grid.appendChild(cards[i]);
    }
}

