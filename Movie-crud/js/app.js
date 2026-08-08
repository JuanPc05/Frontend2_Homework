const session = requireSession(); // definida en auth.js

if (session) {
  initApp(session);
}

/**
 * Punto de entrada de la app, una vez confirmada la sesión.
 * @param {{role: string}} session
 */
function initApp(session) {
  const grid = document.getElementById("movies-grid");
  const roleBadge = document.getElementById("role-badge");
  const adminPanel = document.getElementById("admin-panel");
  const searchInput = document.getElementById("search-input");
  const generoSelect = document.getElementById("filter-genero");
  const anioSelect = document.getElementById("filter-anio");
  const submitBtn = document.getElementById("btn-submit-movie");

  const isAdmin = session.role === "admin";
  roleBadge.textContent = isAdmin ? "Administrador" : "Usuario";
  roleBadge.classList.add(isAdmin ? "role-admin" : "role-user");

  if (isAdmin) {
    adminPanel.classList.remove("hidden");
  }

  populateFilterOptions();
  renderMovies();

  searchInput.addEventListener("input", renderMovies);


  generoSelect.addEventListener("change", renderMovies);
  anioSelect.addEventListener("change", renderMovies);

  if (isAdmin) {
    submitBtn.addEventListener("click", handleAddMovie);
    grid.addEventListener("click", handleGridClick);
  }

  function renderMovies() {
    const movies = getFilteredMovies();

    if (movies.length === 0) {
      grid.innerHTML = `<p class="empty-state">No se encontraron películas.</p>`;
      return;
    }

    grid.innerHTML = movies.map((movie) => renderCard(movie, isAdmin)).join("");
  }

  function getFilteredMovies() {
    const query = searchInput.value.trim().toLowerCase();
    const genero = generoSelect.value;
    const anio = anioSelect.value;

    return getMovies().filter((movie) => {
      const matchTitulo = movie.titulo.toLowerCase().includes(query);
      const matchGenero = genero === "" || movie.genero === genero;
      const matchAnio = anio === "" || String(movie.anio) === anio;

      return matchTitulo && matchGenero && matchAnio;
    });
  }

  function populateFilterOptions() {
    const movies = getMovies();
    const currentGenero = generoSelect.value;
    const currentAnio = anioSelect.value;
    const generos = [...new Set(movies.map((m) => m.genero))].sort();
    const anios = [...new Set(movies.map((m) => m.anio))].sort(
      (a, b) => b - a 
    );

    generoSelect.innerHTML =
      `<option value="">Todos los géneros</option>` +
      generos.map((g) => `<option value="${g}">${g}</option>`).join("");

    anioSelect.innerHTML =
      `<option value="">Todos los años</option>` +
      anios.map((a) => `<option value="${a}">${a}</option>`).join("");

    generoSelect.value = generos.includes(currentGenero) ? currentGenero : "";
    anioSelect.value = anios.map(String).includes(currentAnio) ? currentAnio : "";
  }

  function handleAddMovie() {
    const tituloInput = document.getElementById("input-titulo");
    const generoInput = document.getElementById("input-genero");
    const anioInput = document.getElementById("input-anio");

    const titulo = tituloInput.value.trim();
    const genero = generoInput.value.trim();
    const anio = anioInput.value.trim();

    if (!titulo || !genero || !anio) {
      alert("Completá título, género y año antes de agregar.");
      return;
    }

    addMovie({ titulo, genero, anio: Number(anio) });
    tituloInput.value = "";
    generoInput.value = "";
    anioInput.value = "";
    tituloInput.focus();

    populateFilterOptions();
    renderMovies();
  }

  /**
   * @param {MouseEvent} event
   */
  function handleGridClick(event) {
    const deleteBtn = event.target.closest(".btn-delete");
    if (!deleteBtn) return;

    const card = deleteBtn.closest(".movie-card");
    const id = card.dataset.id; 
    const titulo = card.dataset.titulo;

    const confirmed = confirm(`¿Eliminar "${titulo}" del catálogo?`);
    if (!confirmed) return;

    deleteMovie(id); 
    populateFilterOptions();
    renderMovies();
  }
}

/**
 * @param {Object} movie
 * @param {boolean} isAdmin
 * @returns {string}
 */
function renderCard(movie, isAdmin) {
  return `
    <article class="movie-card glass" data-id="${movie.id}" data-titulo="${escapeHtml(movie.titulo)}">
      <span class="movie-year">${movie.anio}</span>
      <h3>${escapeHtml(movie.titulo)}</h3>
      <span class="movie-genre">${escapeHtml(movie.genero)}</span>
      ${
        isAdmin
          ? `<div class="movie-actions">
               <button class="btn btn-danger btn-icon btn-delete">Eliminar</button>
             </div>`
          : ""
      }
    </article>
  `;
}

/**
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}