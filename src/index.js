// Your code here
const BASE_URL = 'http://localhost:3000/films';

// Fetch and display the first movie's details
function getFirstMovie() {
  fetch(`${BASE_URL}/1`)
    .then(response => response.json())
    .then(movie => displayMovieDetails(movie));
}

// Display movie details in the main section
function displayMovieDetails(movie) {
  const poster = document.getElementById('poster');
  const title = document.getElementById('title');
  const runtime = document.getElementById('runtime');
  const filmInfo = document.getElementById('film-info');
  const showtime = document.getElementById('showtime');
  const ticketNum = document.getElementById('ticket-num');
  const buyButton = document.getElementById('buy-ticket');

  poster.src = movie.poster;
  title.textContent = movie.title;
  runtime.textContent = `${movie.runtime} minutes`;
  filmInfo.textContent = movie.description;
  showtime.textContent = movie.showtime;
  ticketNum.textContent = movie.capacity - movie.tickets_sold;
  buyButton.disabled = movie.capacity - movie.tickets_sold === 0;

  // Handle button text for sold-out films
  buyButton.textContent =
    movie.capacity - movie.tickets_sold === 0 ? 'Sold Out' : 'Buy Ticket';

  // Attach movie id to the Buy button for later use
  buyButton.setAttribute('data-id', movie.id);
}

// Fetch and display all movies in the list
function getAllMovies() {
  fetch(BASE_URL)
    .then(response => response.json())
    .then(movies => {
      const filmList = document.getElementById('films');
      filmList.innerHTML = ''; // Clear the list

      movies.forEach(movie => {
        const filmItem = document.createElement('li');
        filmItem.className = 'film item';
        filmItem.textContent = movie.title;

        // Add a delete button for each movie
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteMovie(movie.id, filmItem));

        // If the movie is sold out, add a 'sold-out' class
        if (movie.capacity - movie.tickets_sold === 0) {
          filmItem.classList.add('sold-out');
        }

        // On click, display movie details
        filmItem.addEventListener('click', () => {
          displayMovieDetails(movie);
        });

        filmItem.appendChild(deleteButton);
        filmList.appendChild(filmItem);
      });
    });
}

// Buy a ticket for a movie
function buyTicket() {
  const button = document.getElementById('buy-ticket');
  const movieId = button.getAttribute('data-id');

  fetch(`${BASE_URL}/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      const remainingTickets = movie.capacity - movie.tickets_sold;

      if (remainingTickets > 0) {
        const updatedTicketsSold = movie.tickets_sold + 1;

        // Update the number of tickets sold on the server
        fetch(`${BASE_URL}/${movie.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
        })
          .then(response => response.json())
          .then(updatedMovie => {
            displayMovieDetails(updatedMovie);
            getAllMovies(); // Refresh the list
          });
      }
    });
}

// Delete a movie from the server and remove it from the list
function deleteMovie(movieId, filmItem) {
  fetch(`${BASE_URL}/${movieId}`, {
    method: 'DELETE',
  })
    .then(() => {
      filmItem.remove(); // Remove the movie from the list
    });
}

// Attach event listener to the "Buy Ticket" button
document.getElementById('buy-ticket').addEventListener('click', buyTicket);

// Initialize the page by fetching the first movie and all movies
getFirstMovie();
getAllMovies();

