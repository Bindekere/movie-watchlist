let moviedisplay = []
let watchList = []
const searchResult = document.querySelector("main")
const searchInput = document.getElementById("movieSearch")
const searchBtn = document.querySelector(".searchbtn")
const saveToWatchlist = document.querySelector(".watchlist-add")

searchInput.addEventListener("search",()=>{
    if(searchInput.value){
        moviedisplay = []
        returnSearchResult(searchInput.value)
    }
    else{searchInput.placeholder = "Please enter a valid input.."}
})
/* i included 2 event listeners for both the input field and
the search button because the design given to me suggested that
but me personally i would not include a search button because it
does the same thing as pressing the "enter key" on the search input.*/

searchBtn.addEventListener("click",()=>{
    if(searchInput.value){
        moviedisplay = []
        returnSearchResult(searchInput.value)
    }
    else{searchInput.placeholder = "Please enter a valid input.."}
})
async function returnSearchResult(searchvalue){
    const res = await fetch(`http://www.omdbapi.com/?apikey=ec3fffe0&s=${searchvalue}`)
    const data = await res.json()  
            console.log(data)
            for (const movie of data.Search){
                const response = await fetch(`http://www.omdbapi.com/?apikey=ec3fffe0&i=${movie.imdbID}`)
                const specificData = await response.json()
                        
                        // console.log(specificData.Title)
                        const movieObject = {
                            Title: specificData.Title,
                            Poster: specificData.Poster,
                            Rating: specificData.imdbRating,
                            Runtime: specificData.Runtime,
                            Genre: specificData.Genre,
                            Plot: specificData.Plot,
                            Type: specificData.Type    
                        }
                        // console.log(movieObject)
                        moviedisplay.push(movieObject)
                        
                    }
            
            renderMovieDisplay()
            console.log(moviedisplay)  
    }


function renderMovieDisplay() {
    let html = ``
    moviedisplay.sort((a, b) => b.Rating - a.Rating)

    for (object of moviedisplay) {
        html +=
            `<div class="movie-container"><!-- the container -->
                 <div class="movie-poster">
                     <img src="${object.Poster}" alt="Movie Poster">
                 </div>
                 <div class="movie-details">
                    <h3 class="movie-title"}">${object.Title} <span class="rating"><i class='bx bxs-star'></i>${object.Rating}</span></h3>
                    <p class="movie-info"><!-- the line below the title containig info about the movie -->
                        <span class="runtime">${object.Runtime === "N/A" || object.Type === "series" ? "series| ": object.Runtime+"| "}</span><span class="genre">${object.Genre}</span> 
                    </p>
                    <button class="watchlist-add" onClick="addToWatchlist(event)"><img src="Icon.svg">Watchlist</button>
                    <p class="movie-plot">${object.Plot}</p>
                </div>
        </div>`
        
    }
    searchResult.innerHTML = html   
}
 function addToWatchlist(event){
    const btn = event.target
    const movie = btn.parentElement.parentElement
    
    btn.innerHTML = "<img src='check-circle-solid-24.png'>Watchlist"
    btn.disabled = true
    let alreadyExisting =  JSON.parse(localStorage.getItem("WatchList:"))
    if (alreadyExisting == null){
        // watchList = []
        watchList.push(movie.outerHTML)
        localStorage.setItem("WatchList:", JSON.stringify(watchList))}
    else{
        alreadyExisting.push(movie.outerHTML)
        localStorage.setItem("WatchList:", JSON.stringify(alreadyExisting))
    }
}  




