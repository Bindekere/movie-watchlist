const WATCHLIST_KEY = 'WatchList:';
const savedMovies = document.querySelector("main");
const clearDisplay = document.querySelector(".clearbtn");

class WatchlistManager {
    constructor() {
        this.watchlist = this.loadWatchlist();
        this.init();
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

    removeMovie(movieHTML) {
        const index = this.watchlist.indexOf(movieHTML);
        if (index > -1) {
            this.watchlist.splice(index, 1);
            this.saveWatchlist();
            return true;
        }
        return false;
    }

    clearWatchlist() {
        this.watchlist = [];
        localStorage.removeItem(WATCHLIST_KEY);
        this.renderEmptyState();
    }

    init() {
        this.setupObserver();
        this.renderWatchlist();
        this.setupEventListeners();
    }

    setupObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations[0].addedNodes.forEach(node => {
                const removeMovie = node.querySelector(".watchlist-add");
                if (removeMovie) {
                    removeMovie.disabled = false;
                    removeMovie.innerHTML = "<img src='checkbox-minus-solid-24.png' alt='Remove from watchlist'>Remove";
                    removeMovie.setAttribute("onclick", "watchlistManager.removeMovieObject(event)");
                }
            });
        });

        this.observer.observe(savedMovies, { childList: true });
    }

    renderWatchlist() {
        if (!this.watchlist.length) {
            this.renderEmptyState();
            return;
        }

        let html = '';
        for (const displayObject of this.watchlist) {
            html += displayObject;
        }
        savedMovies.innerHTML = html;
    }

    renderEmptyState() {
        savedMovies.innerHTML = `
            <img src="Icon.png" alt="Empty watchlist">
            <p>Your watchlist is empty</p>
        `;
    }

    setupEventListeners() {
        clearDisplay.addEventListener("click", () => this.clearWatchlist());
    }

    removeMovieObject(event) {
        const btn = event.target;
        const movieContainer = btn.closest('.movie-container');
        
        if (movieContainer) {
            movieContainer.remove();
            this.removeMovie(movieContainer.outerHTML);
            
            if (!savedMovies.children.length) {
                this.renderEmptyState();
            }
        }
    }
}

const watchlistManager = new WatchlistManager();
