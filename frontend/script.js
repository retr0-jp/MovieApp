const API_URL = "http://localhost:5204/api/movies";

const form = document.getElementById("movie-form");
const list = document.getElementById("movie-list");

async function loadMovies() {
  const res = await fetch(API_URL);
  const movies = await res.json();
  list.innerHTML = "";
  movies.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.title}(★${m.rating}) - ${m.comment}`;
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newMovie = {
    title: document.getElementById("title").value,
    rating: Number(document.getElementById("rating").value),
    watchedDate: document.getElementById("watchedDate").value,
    comment: document.getElementById("comment").value,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMovie),
  });

  form.reset();
  loadMovies();
});

loadMovies();