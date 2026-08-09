const API_URL = "http://localhost:5204/api/movies";

const form = document.getElementById("movie-form");
const list = document.getElementById("movie-list");
let editingId = null;

async function loadMovies() {
  const res = await fetch(API_URL);
  const movies = await res.json();
  list.innerHTML = "";

  // カテゴリごとにグループ化
  const grouped = {};
  movies.forEach(m => {
    const cat = m.category || "未分類";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(m);
  });

  // カテゴリごとにセクションを作成
  Object.keys(grouped).forEach(category => {
    const section = document.createElement("div");
    section.className = "mb-5";

    const heading = document.createElement("h3");
    heading.className = "mb-3";
    heading.textContent = category;
    section.appendChild(heading);

    const row = document.createElement("div");
    row.className = "row row-cols-1 row-cols-md-4 g-3"; // 4つ横並び、はみ出たら折り返し

    grouped[category].forEach(m => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${m.title} <span class="badge bg-warning text-dark">★${m.rating}</span></h5>
            <p class="card-text text-muted flex-grow-1">${m.comment}</p>
            <small class="text-muted mb-2">${m.watchedDate.split('T')[0]}</small>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-1"
                onclick="startEdit(${m.id}, '${m.title}', '${m.category}', ${m.rating}, '${m.watchedDate.split('T')[0]}', '${m.comment}')">編集</button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteMovie(${m.id})">削除</button>
            </div>
          </div>
        </div>
      `;
      row.appendChild(col);
    });

    section.appendChild(row);
    list.appendChild(section);
  });
}

function startEdit(id, title, category, rating, watchedDate, comment) {
  editingId = id;
  document.getElementById("title").value = title;
  document.getElementById("category").value = category;
  document.getElementById("rating").value = rating;
  document.getElementById("watchedDate").value = watchedDate;
  document.getElementById("comment").value = comment;
  document.querySelector("button[type='submit']").textContent = "更新";
}

async function deleteMovie(id) {
  if (!confirm("削除しますか?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadMovies();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const movieData = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    rating: Number(document.getElementById("rating").value),
    watchedDate: document.getElementById("watchedDate").value,
    comment: document.getElementById("comment").value,
  };

  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    });
    editingId = null;
    document.querySelector("button[type='submit']").textContent = "追加";
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    });
  }

  form.reset();
  loadMovies();
});

loadMovies();