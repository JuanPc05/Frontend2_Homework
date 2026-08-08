const session = requireSession(); // definida en auth.js

if (session) {
  initApp(session);
}

/**
 * Punto de entrada de la app, una vez confirmada la sesión.
 * @param {{role: string}} session
 */
function initApp(session) {
  // --- Referencias a elementos del DOM -----------------------------------
  const grid = document.getElementById("movies-grid");
  const roleBadge = document.getElementById("role-badge");
  const adminPanel = document.getElementById("admin-panel");
  const searchInput = document.getElementById("search-input");
  const generoSelect = document.getElementById("filter-genero");
  const anioSelect = document.getElementById("filter-anio");
  const submitBtn = document.getElementById("btn-submit-movie");
  const cancelEditBtn = document.getElementById("btn-cancel-edit");
  const adminPanelTitle = document.getElementById("admin-panel-title");
  const posterInput = document.getElementById("input-poster");
  const posterPreview = document.getElementById("poster-preview");

 
  let editingId = null;

  const isAdmin = session.role === "admin";

  // --- Rol en el header ----------------------------------------------------
  roleBadge.textContent = isAdmin ? "Administrador" : "Usuario";
  roleBadge.classList.add(isAdmin ? "role-admin" : "role-user");


  if (isAdmin) {
    adminPanel.classList.remove("hidden");
  }

  // --- Render inicial --------------------------------------------------
  populateFilterOptions();
  renderMovies();

  // --- Event listeners ---------------------------------------------------

  searchInput.addEventListener("input", renderMovies);


  generoSelect.addEventListener("change", renderMovies);
  anioSelect.addEventListener("change", renderMovies);

  if (isAdmin) {
    submitBtn.addEventListener("click", handleSubmitMovie);
    cancelEditBtn.addEventListener("click", exitEditMode);

    posterInput.addEventListener("input", handlePosterUrlChanged);

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

  function handlePosterUrlChanged() {
    const url = posterInput.value.trim();

    if (!url) {
      posterPreview.classList.add("hidden");
      posterPreview.removeAttribute("src");
      return;
    }

    posterPreview.onload = () => posterPreview.classList.remove("hidden");
    posterPreview.onerror = () => posterPreview.classList.add("hidden");
    posterPreview.src = url;
  }

 
  function handleSubmitMovie() {
    const tituloInput = document.getElementById("input-titulo");
    const generoInput = document.getElementById("input-genero");
    const anioInput = document.getElementById("input-anio");

    const titulo = tituloInput.value.trim();
    const genero = generoInput.value.trim();
    const anio = anioInput.value.trim();
    const poster = posterInput.value.trim(); 

    if (!titulo || !genero || !anio) {
      alert("Completá título, género y año antes de continuar.");
      return;
    }

    const movieData = { titulo, genero, anio: Number(anio), poster: poster || null };

    if (editingId) {
      updateMovie(editingId, movieData);
    } else {
      addMovie(movieData); 
    }

    exitEditMode(); 

    populateFilterOptions();
    renderMovies();
  }

  /**
   * @param {Object} movie
   */
  function enterEditMode(movie) {
    editingId = movie.id;

    document.getElementById("input-titulo").value = movie.titulo;
    document.getElementById("input-genero").value = movie.genero;
    document.getElementById("input-anio").value = movie.anio;
    posterInput.value = movie.poster || "";

    handlePosterUrlChanged();

    adminPanelTitle.textContent = "Editar película";
    submitBtn.textContent = "Guardar cambios";
    cancelEditBtn.classList.remove("hidden");

    adminPanelTitle.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function exitEditMode() {
    editingId = null;

    document.getElementById("input-titulo").value = "";
    document.getElementById("input-genero").value = "";
    document.getElementById("input-anio").value = "";
    posterInput.value = "";
    posterPreview.classList.add("hidden");
    posterPreview.removeAttribute("src");

    adminPanelTitle.textContent = "Agregar película";
    submitBtn.textContent = "Agregar";
    cancelEditBtn.classList.add("hidden");
  }

  /**
   * @param {MouseEvent} event
   */
  function handleGridClick(event) {

    const editBtn = event.target.closest(".btn-edit");
    const deleteBtn = event.target.closest(".btn-delete");

    if (editBtn) {
      const card = editBtn.closest(".movie-card");
      const id = card.dataset.id;

      const movie = getMovies().find((m) => m.id === id);
      if (movie) enterEditMode(movie);
      return;
    }

    if (deleteBtn) {
      const card = deleteBtn.closest(".movie-card");
      const id = card.dataset.id;
      const titulo = card.dataset.titulo;
      const confirmed = confirm(`¿Eliminar "${titulo}" del catálogo?`);
      if (!confirmed) return;

      deleteMovie(id); // definida en storage.js

      if (editingId === id) exitEditMode();

      populateFilterOptions();
      renderMovies();
    }
  }
}

/**
 * @param {Object} movie
 * @param {boolean} isAdmin
 * @returns {string}
 */
function renderCard(movie, isAdmin) {
  const posterHtml = movie.poster
    ? `<img class="movie-poster" src="${escapeHtml(movie.poster)}" alt="Póster de ${escapeHtml(movie.titulo)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: 'movie-poster-placeholder', textContent: '🎬'}))" />`
    : `<div class="movie-poster-placeholder">🎬</div>`;

  return `
    <article class="movie-card glass" data-id="${movie.id}" data-titulo="${escapeHtml(movie.titulo)}">
      ${posterHtml}
      <div class="movie-body">
        <span class="movie-year">${movie.anio}</span>
        <h3>${escapeHtml(movie.titulo)}</h3>
        <span class="movie-genre">${escapeHtml(movie.genero)}</span>
        ${
          isAdmin
            ? `<div class="movie-actions">
                 <button class="btn btn-secondary btn-icon btn-edit">Editar</button>
                 <button class="btn btn-danger btn-icon btn-delete">Eliminar</button>
               </div>`
            : ""
        }
      </div>
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