let MOVIES_URL = "https://japceibal.github.io/japflix_api/movies-data.json";
let MOVIES_LIST = document.getElementById("list");
let SEARCH_INPUT = document.getElementById("searchInput");
let SEARCH_FORM = document.getElementById("search-form");
let OFFCANVAS_BODY = document.getElementById("canvas-body");
let DROPDOWN_MENU = document.getElementById("dropdown-menu");
let FETCHED_MOVIES;

// Función para renderizar estrellas
function stars(vote_average) {
    let totalStars = 5;
    let filledStars = Math.round(vote_average / 2); // Máximo de 5 estrellas
    let starsHTML = "";

    for (let i = 0; i < totalStars; i++) {
        if (i < filledStars) {
            starsHTML += `<i class="fa fa-star" style="color: yellow;"></i>`;
        } else {
            starsHTML += `<i class="fa fa-star" style="color: gray;"></i>`;
        }
    }

    return starsHTML;
}

// Función para mostrar las películas
function showMovies(moviesArray) {
    MOVIES_LIST.innerHTML = "";

    moviesArray.forEach(movie => {
        let item = document.createElement("div");
        item.className = "search-result list-group-item list-group-item-action";
        item.setAttribute("data-bs-toggle", "offcanvas");
        item.setAttribute("data-bs-target", "#offcanvasTop");
        item.id = `${movie.id}`;

        let container = document.createElement("div");
        container.className = "d-flex w-100 justify-content-between";

        let subContainer = document.createElement("div");
        subContainer.className = "mb-1";

        let title = document.createElement("h5");
        title.innerHTML = `${movie.title}`;

        let tagLine = document.createElement("p");
        tagLine.innerHTML = `${movie.tagline}`;

        let voteAverage = document.createElement("p");
        voteAverage.innerHTML = stars(movie.vote_average);

        // Añado evento para mostrar detalles en el offcanvas
        item.addEventListener("click", () => {
            showMovieDetails(movie);
        });

        subContainer.appendChild(title);
        subContainer.appendChild(tagLine);
        subContainer.appendChild(voteAverage);

        container.appendChild(subContainer);
        item.appendChild(container);

        MOVIES_LIST.appendChild(item);
    });
}

// Función para mostrar detalles de la película en el offcanvas
function showMovieDetails(movie) {
    OFFCANVAS_BODY.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
    `;

    movie.genres.forEach(genre => {
        OFFCANVAS_BODY.innerHTML += `<p>${genre.name}</p>`;
    });

    let releaseDateYear = movie.release_date.slice(0, 4);
    DROPDOWN_MENU.innerHTML = `
        <li class="dropdown-item"><strong>Year:</strong> ${releaseDateYear}</li>
        <li class="dropdown-item"><strong>Runtime:</strong> ${movie.runtime} mins</li>
        <li class="dropdown-item"><strong>Budget:</strong> $${movie.budget.toLocaleString()}</li>
        <li class="dropdown-item"><strong>Revenue:</strong> $${movie.revenue.toLocaleString()}</li>
    `;
}

// Función para filtrar películas
function filterMovies() {
    let searchInput = SEARCH_INPUT.value.toLowerCase();
    return FETCHED_MOVIES.filter(movie => {
        let movieTitle = movie.title.toLowerCase();
        let movieTagline = movie.tagline ? movie.tagline.toLowerCase() : "";
        let movieOverview = movie.overview.toLowerCase();
        let movieGenres = movie.genres.map(genre => genre.name.toLowerCase());

        return (
            movieTitle.includes(searchInput) ||
            movieTagline.includes(searchInput) ||
            movieOverview.includes(searchInput) ||
            movieGenres.some(genre => genre.includes(searchInput))
        );
    });
}

// Evento para manejar la búsqueda
SEARCH_FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    showMovies(filterMovies());
});

// Cargar las películas cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
    fetch(MOVIES_URL)
        .then(response => response.json())
        .then(moviesList => {
            FETCHED_MOVIES = moviesList;
        })
        .catch(error => console.error("Error de fetch", error));
});