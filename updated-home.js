// Constants
const API_KEY = 'ec3fffe0';
const API_URL = 'https://www.omdbapi.com/';
const WATCHLIST_KEY = 'WatchList:';

// DOM Elements
const searchResult = document.querySelector("main");
const searchInput = document.getElementById("movieSearch");
const searchBtn = document.querySelector(".searchbtn");

let moviedisplay = [];

// Watchlist Manager
class WatchlistManager {
    constructor() {
        this.watchlist = this.loadWatchlist();
    }

    loadWatchlist() {
        try {
            const stored = localStorage.getItem(WATCHLIST_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading watchlist:', error);
            return [];
        }
    }

    saveWatchlist() {
        try {
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(this.watchlist));
        } catch (error) {
            console.error('Error saving watchlist:', error);
        }
    }

    addMovie(movieHTML) {
        if (!this.watchlist.includes(movieHTML)) {
            this.watchlist.push(movieHTML);
            this.saveWatchlist();
            return true;
        }
        return false;
    }
}

const watchlistManager = new WatchlistManager();

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Event Listeners
searchInput.addEventListener("search", () => {
    handleSearch(searchInput.value);
});

searchBtn.addEventListener("click", () => {
    handleSearch(searchInput.value);
});

const handleSearch = (value) => {
    if (value.trim()) {
        moviedisplay = [];
        returnSearchResult(value.trim());
    } else {
        searchInput.placeholder = "Please enter a valid input..";
    }
};

// API Functions
async function returnSearchResult(searchValue) {
    try {
        // Show loading state
        searchResult.innerHTML = '<div class="loading"></div>';
        
        // Initial search
        const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchValue)}`);
        const data = await res.json();
        
        if (data.Error) {
            throw new Error(data.Error);
        }
        
        if (!data.Search || data.Search.length === 0) {
            searchResult.innerHTML = '<div class="no-results">No movies found. Try another search.</div>';
            return;
        }

        // Fetch all movie details in parallel
        const moviePromises = data.Search.map(movie => 
            fetch(`${API_URL}?apikey=${API_KEY}&i=${movie.imdbID}`)
                .then(res => res.json())
                .then(specificData => {
                    // Check if any critical data is missing, skip the movie if so
                    if (!specificData.Title || specificData.Title === "N/A" || 
                        !specificData.Poster || specificData.Poster === "N/A" || 
                        !specificData.imdbRating || specificData.imdbRating === "N/A" ||
                        !specificData.Runtime || specificData.Runtime === "N/A" ||
                        !specificData.Genre || specificData.Genre === "N/A" ||
                        !specificData.Plot || specificData.Plot === "N/A") {
                        return null; // Skip this movie
                    }

                    return {
                        Title: specificData.Title,
                        Poster: specificData.Poster,
                        Rating: specificData.imdbRating,
                        Runtime: specificData.Runtime,
                        Genre: specificData.Genre,
                        Plot: specificData.Plot,
                        Type: specificData.Type || 'N/A'
                    };
                })
        );

        // Wait for all movie promises and filter out null values
        moviedisplay = (await Promise.all(moviePromises)).filter(movie => movie !== null);

        renderMovieDisplay();
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        searchResult.innerHTML = `<div class="error">Something went wrong: ${error.message}</div>`;
    }
}

function renderMovieDisplay() {
    if (!moviedisplay.length) {
        searchResult.innerHTML = '<div class="no-results">No movies found.</div>';
        return;
    }

    let html = '';
    moviedisplay.sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating));

    for (const object of moviedisplay) {
        html += `
            <div class="movie-container">
                <div class="movie-poster">
                    <img src="${object.Poster}" alt="${object.Title} Poster" onerror="this.src='placeholder-poster.png'">
                </div>
                <div class="movie-details">
                    <h3 class="movie-title">${object.Title} <span class="rating"><i class='bx bxs-star'></i>${object.Rating}</span></h3>
                    <p class="movie-info">
                        <span class="runtime">${object.Runtime === "N/A" || object.Type === "series" ? "series| " : object.Runtime + "| "}</span>
                        <span class="genre">${object.Genre}</span> 
                    </p>
                    <button class="watchlist-add" onClick="addToWatchlist(event)">
                        <img src="Icon.svg" alt="Add to watchlist">Watchlist
                    </button>
                    <p class="movie-plot">${object.Plot}</p>
                </div>
            </div>`;
    }
    searchResult.innerHTML = html;
}

function addToWatchlist(event) {
    const btn = event.target;
    const movie = btn.parentElement.parentElement;
    
    btn.innerHTML = "<img src='check-circle-solid-24.png' alt='Added to watchlist'>Watchlist";
    btn.disabled = true;
    
    watchlistManager.addMovie(movie.outerHTML);
}
