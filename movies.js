let db = firebase.firestore()

window.addEventListener('DOMContentLoaded', async function(event) {
    
    let url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=62f31346c7faf343b527c79992e28f65&language=en-US'
    let response = await fetch(url)
    let movies = await response.json()
    console.log(movies)

    
    let moviesList = movies.results
    console.log(moviesList.length)

    let fetchMovies = await db.collection('watched_movies').get()
    let watched_movies = fetchMovies.docs
    console.log(watched_movies)
  
    for (let i=0;i<moviesList.length;i++) {

        let movieID = moviesList[i].id
        let moviePoster = moviesList[i].poster_path

        let opacity

        let alreadyWatched = await db.collection('watched_movies').doc(`${movieID}`).get()
        if (!alreadyWatched.exists) {
            //console.log(`${moviesList[i].original_title} has not been watched.`)
            opacity = ''
        } else {
            console.log(`${moviesList[i].original_title} has been watched.`)
            opacity = 'opacity-20'
        }

        document.querySelector('.movies').insertAdjacentHTML('beforeend',`
        <div class="w-1/5 p-4 movie-${movieID} ${opacity}">
            <img src="https://image.tmdb.org/t/p/w500${moviePoster}" class="w-full">
            <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
        </div>
        `)
   
        let watchButton = document.querySelector(`.movie-${movieID} .watched-button`)
        let uniqueMovie = document.querySelector(`.movie-${movieID}`)

        watchButton.addEventListener('click', async function(event) {
            event.preventDefault()
            uniqueMovie.classList.add('opacity-20')
            console.log(`${moviesList[i].original_title} was watched.`)
            await db.collection('watched_movies').doc(`${movieID}`).set({})

        })


    }
  
    
  })