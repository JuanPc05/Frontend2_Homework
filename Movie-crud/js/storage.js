const STORAGE_KEYS = {
  MOVIES: "movies",
  SESSION: "session",
};

/**
 * @returns {Array<Object>} Array de películas, o [] si no hay nada guardado.
 */
function getMovies() {
  const raw = localStorage.getItem(STORAGE_KEYS.MOVIES);
  if (raw === null) {
    return [];
  }

  return JSON.parse(raw);
}

/**
 * @param {Array<Object>} movies
 */
function saveMovies(movies) {
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
}

/**
 * @param {Object} movieData - { titulo, genero, anio, poster }
 * @returns {Object} La película creada, con su id ya asignado.
 */
function addMovie(movieData) {
  const movies = getMovies();

  const newMovie = {
    id: generateId(),
    ...movieData, 
  };

  movies.push(newMovie);
  saveMovies(movies);

  return newMovie;
}

/**
 * @param {string} id
 */
function deleteMovie(id) {
  const movies = getMovies();
  const updated = movies.filter((movie) => movie.id !== id);

  saveMovies(updated);
}

/**
 * @param {string} id
 * @param {Object} changes - Propiedades a sobreescribir, ej. { titulo: "..." }
 */
function updateMovie(id, changes) {
  const movies = getMovies();
  const updated = movies.map((movie) =>
    movie.id === id ? { ...movie, ...changes } : movie
  );

  saveMovies(updated);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Sesión / rol -------------------------------------------------------

/**
 * Guarda el rol activo ("admin" | "user") en localStorage.
 * @param {string} role
 */
function setSession(role) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ role }));
}

/**
 * Recupera la sesión activa, o null si nadie inició sesión.
 * @returns {{role: string} | null}
 */
function getSession() {
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  return raw === null ? null : JSON.parse(raw);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}