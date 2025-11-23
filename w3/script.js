/* =======================================================
   GLOBAL PAGE LOAD (Home Page + Services Filters Only)
   ======================================================= */
window.onload = function () {

    /* -------------------------
       1) BACK TO TOP (Home)
       ------------------------- */
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.onscroll = function () {
            if (document.documentElement.scrollTop > 300) {
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

    /* -------------------------
       2) REAL-TIME CLOCK
       ------------------------- */
    const clock = document.getElementById("clock");

    if (clock) {
        function updateClock() {
            clock.textContent = new Date().toLocaleTimeString();
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    /* -------------------------
       3) Services Page Filters
       ------------------------- */
    const grid = document.getElementById("servicesGrid");

    if (grid) {
        let nodeList = grid.getElementsByClassName("service-card");
        let cards = Array.from(nodeList);

        shuffle(cards);
        render(cards, grid);

        /* SORT */
        const sortSelect = document.getElementById("sort-services");

        if (sortSelect) {
            sortSelect.onchange = function () {
                const v = sortSelect.value;

                if (v === "price-low-high") {
                    cards.sort((a, b) => a.dataset.price - b.dataset.price);
                } else if (v === "price-high-low") {
                    cards.sort((a, b) => b.dataset.price - a.dataset.price);
                } else if (v === "name-az") {
                    cards.sort((a, b) =>
                        a.dataset.name.localeCompare(b.dataset.name)
                    );
                } else if (v === "name-za") {
                    cards.sort((a, b) =>
                        b.dataset.name.localeCompare(a.dataset.name)
                    );
                }

                render(cards, grid);
            };
        }

        /* SEARCH */
        const searchInput = document.getElementById("service-search");

        if (searchInput) {
            searchInput.onkeyup = function () {
                const text = searchInput.value.toLowerCase();

                cards.forEach(card => {
                    const name = card.dataset.name.toLowerCase();
                    const desc = card.querySelector(".desc").textContent.toLowerCase();

                    if (name.includes(text) || desc.includes(text)) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });
            };
        }
    }
}; // END window.onload



/* =======================================================
   SHARED FUNCTIONS
   ======================================================= */
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function render(cards, grid) {
    grid.innerHTML = "";
    cards.forEach(c => grid.appendChild(c));
}



/* =======================================================
   DOMContentLoaded (Favorites, Dark Theme, Forms)
   ======================================================= */
document.addEventListener("DOMContentLoaded", function () {

    /* -------------------------
       1) DARK MODE
       ------------------------- */
    const toggle = document.getElementById("themeToggle");
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("theme-dark");
        if (toggle) toggle.checked = true;
    }

    if (toggle) {
        toggle.addEventListener("change", () => {
            if (toggle.checked) {
                document.body.classList.add("theme-dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("theme-dark");
                localStorage.setItem("theme", "light");
            }
        });
    }



    /* -------------------------
       2) FAVORITES SYSTEM
       ------------------------- */
    const favButtons = document.querySelectorAll(".fav");

    if (favButtons.length > 0) {

        let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        let favNames = favorites.map(f => f.name);

        favButtons.forEach(btn => {
            let card = btn.closest(".service-card");
            let name = card.dataset.name;

            if (favNames.includes(name)) {
                btn.classList.add("fav-active");
                btn.textContent = "❤️";
            }

            btn.addEventListener("click", function () {

                let price = card.dataset.price;
                let desc = card.querySelector(".desc").textContent;
                let imgSrc = card.querySelector("img").src.split("images/")[1];

                if (favNames.includes(name)) {

                    favorites = favorites.filter(f => f.name !== name);
                    favNames = favNames.filter(n => n !== name);

                    btn.classList.remove("fav-active");
                    btn.textContent = "♡";
                    alert("Removed from favorites");

                } else {

                    favorites.push({ name, price, desc, img: imgSrc });
                    favNames.push(name);

                    btn.classList.add("fav-active");
                    btn.textContent = "❤️";
                    alert("Added to favorites");
                }

                localStorage.setItem("favorites", JSON.stringify(favorites));
            });
        });
    }

    /* LOAD ON CUSTOMER PAGE */
    const favContainer = document.getElementById("favGrid");

    if (favContainer) {
        let favs = JSON.parse(localStorage.getItem("favorites") || "[]");

        favContainer.innerHTML = "";

        favs.forEach(item => {
            let card = document.createElement("div");
            card.className = "favorite-card";

            card.innerHTML = `
                <img src="images/${item.img}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p><strong>${item.price}</strong> $</p>
                <p>${item.desc}</p>
            `;

            favContainer.appendChild(card);
        });
    }



    /* -------------------------
       3) REQUEST SERVICE
       ------------------------- */

    const requestForm = document.querySelector(".request-form");

    if (requestForm) {

        const service = document.getElementById("service");
        const name = document.getElementById("name");
        const date = document.getElementById("date");
        const desc = document.getElementById("desc");

        let addedRequests = [];

        requestForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (service.value === "Select Service:") {
                alert("Please select a service.");
                return;
            }

            if (!/^[A-Za-z]+\s[A-Za-z]+$/.test(name.value.trim())) {
                alert("Full name must be first + last.");
                return;
            }

            const today = new Date();
            const selected = new Date(date.value);

            if (isNaN(selected.getTime()) || selected - today < 3 * 86400000) {
                alert("Due date must be at least 3 days from today.");
                return;
            }

            if (desc.value.trim().length < 100) {
                alert("Description must be at least 100 characters.");
                return;
            }

            const goDashboard = !confirm("Request sent!\nOK = Stay\nCancel = Dashboard");

            if (goDashboard) {
                window.location.href = "customer.html";
                return;
            }

            addedRequests.push({
                service: service.value,
                name: name.value,
                date: date.value,
                desc: desc.value.trim(),
            });

            showRequests();
            requestForm.reset();
        });

        function showRequests() {
            let box = document.getElementById("added-requests");

            if (!box) {
                box = document.createElement("div");
                box.id = "added-requests";
                box.innerHTML = "<h3>Added Requests:</h3>";
                document.querySelector(".form-box").appendChild(box);
            }

            box.innerHTML = "<h3>Added Requests:</h3>";

            addedRequests.forEach(req => {
                let c = document.createElement("div");
                c.className = "req-card";

                c.innerHTML = `
                    <p><strong>Service:</strong> ${req.service}</p>
                    <p><strong>Name:</strong> ${req.name}</p>
                    <p><strong>Due Date:</strong> ${req.date}</p>
                    <p><strong>Description:</strong> ${req.desc}</p>
                `;
                box.appendChild(c);
            });
        }
    }



    /* -------------------------
       4) EVALUATE SERVICE
       ------------------------- */
    const evaluateForm = document.querySelector(".evaluate-form");

    if (evaluateForm) {

        const serviceEval = document.getElementById("select-service");
        const feedback = document.getElementById("feedback");

        evaluateForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (serviceEval.value === "Select Service:") {
                alert("Please select a service.");
                return;
            }

            let rating = document.querySelector("input[name='rating']:checked");
            if (!rating) {
                alert("Please choose a rating.");
                return;
            }

            if (feedback.value.trim().length < 5) {
                alert("Please write feedback.");
                return;
            }

            if (Number(rating.value) >= 4) {
                alert("Thank you for your positive review!");
            } else {
                alert("We apologize for the inconvenience.");
            }

            window.location.href = "customer.html";
        });
    }

}); // END DOMContentLoaded

// ========= Join Our Team Form Validation (About Us page) =========
function validateJoinForm() {

    // DOM access
    var first  = document.getElementById("first-name").value;
    var last   = document.getElementById("last-name").value;
    var dob    = document.getElementById("dob").value;
    var email  = document.getElementById("email").value;
    var edu    = document.getElementById("education").value;
    var skills = document.getElementById("skills").value;
    var exp    = document.getElementById("experties").value;
    var photo  = document.getElementById("upload-photo").value;

    //  No empty fields one by one
if (first == "") {
    alert("Please fill the First Name field.");
    return false;
}

if (last == "") {
    alert("Please fill the Last Name field.");
    return false;
}

if (dob == "") {
    alert("Please fill the Date of Birth field.");
    return false;
}

if (email == "") {
    alert("Please fill the Email field.");
    return false;
}

if (edu == "") {
    alert("Please fill the Education field.");
    return false;
}

if (skills == "") {
    alert("Please fill the Skills field.");
    return false;
}

if (exp == "") {
    alert("Please fill the Expertise field.");
    return false;
}

if (photo == "") {
    alert("Please upload a Photo.");
    return false;
}

    // name cannot start with number
    if (/^[0-9]/.test(first) || /^[0-9]/.test(last)) {
        alert("Name fields cannot start with a number.");
        return false;
    }

    //  DOB must be before 2008 
    var year = parseInt(dob.substring(0, 4));
    if (year > 2008) {
        alert("Date of Birth must be before 2008.");
        return false;
    }

    // Photo validation using extension 
    var dot = photo.lastIndexOf(".");
    if (dot == -1) {
        alert("Please upload a valid image.");
        return false;
    }

    var ext = photo.substring(dot + 1).toLowerCase();

    if (!/(jpg|jpeg|png|gif)$/i.test(ext)) {
        alert("Photo must be an image (jpg, jpeg, png, gif).");
        return false;
    }

    // SUCCESS
    alert("Thank you " + first + " " + last + "! Your application has been submitted.");
    return true;
}

// To cancel the form submisiion
function clearJoinForm() {
    document.getElementById("join-us-form").reset();
}


