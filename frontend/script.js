const API_URL = "http://localhost:5204/api/movies";

const form = document.getElementById("movie-form");
const list = document.getElementById("movie-list");

async function loadMovies() {
  const res = await fetch(API_URL);
  const movies = await res.json();
  list.innerHTML = "";
  movies.forEach(m => {
  const li = document.createElement("li");
  li.className = "card mb-2";
  li.innerHTML = `
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <h5 class="card-title mb-1">${m.title} <span class="badge bg-warning text-dark">★${m.rating}</span></h5>
        <p class="card-text text-muted mb-0">${m.comment}</p>
        <small class="text-muted">${m.watchedDate.split('T')[0]}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="startEdit(${m.id}, '${m.title}', ${m.rating}, '${m.watchedDate.split('T')[0]}', '${m.comment}')">編集</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteMovie(${m.id})">削除</button>
      </div>
    </div>
  `;
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