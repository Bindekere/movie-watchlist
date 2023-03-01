let WatchlistFromLocalStorage = JSON.parse(localStorage.getItem("WatchList:"))
const savedMovies = document.querySelector("main")
const clearDisplay = document.querySelector(".clearbtn")

// i added a mutational observer object to detect changes in the dom and respond to them.
let observer = new MutationObserver((mutations)=>{
    console.log(mutations)
    mutations[0].addedNodes.forEach(node =>{
            // console.log(mutation.addedNodes)
            let removeMovie = node.querySelector(".watchlist-add")
            removeMovie.disabled = false
            removeMovie.innerHTML = "<img src='checkbox-minus-solid-24.png'>Remove"
            // removeMovie.disabled = false
            // console.log(removeMovie.innerHTML)
            removeMovie.setAttribute("onclick","removeMovieObject(event)")
        
    })
})
// Node, config
// In this case we'll listen to childlist changes to body
const targetNode = savedMovies
observer.observe(targetNode, {childList: true})

html = ''

if (WatchlistFromLocalStorage){
    for (const displayObject of WatchlistFromLocalStorage){
        html += displayObject
    }
    savedMovies.innerHTML = html
}

clearDisplay.addEventListener("click",()=>{
    localStorage.clear()
    savedMovies.innerHTML = 
    `<img src="Icon.png" alt="movie">
     <p>Watchlist</p>
    `
})


       
        // removeMovie.setAttribute("onclick","removeMovieObject(event)")

        function removeMovieObject(event){
            const btn = event.target
            const btnParent = btn.parentElement.parentElement
            console.log(btnParent)
            btnParent.remove()
            
            let WatchlistToLocalStorage = Array.from(savedMovies.childNodes)
            WatchlistToLocalStorage = WatchlistToLocalStorage.map(value => value = value.outerHTML)
            console.log(WatchlistToLocalStorage)
            localStorage.setItem("WatchList:", JSON.stringify(WatchlistToLocalStorage))
        }
    