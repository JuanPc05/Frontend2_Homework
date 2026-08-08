/**
 * @param {"admin" | "user"} role
 */
function login(role) {
  setSession(role); 
  window.location.href = "movies.html";
}

function logout() {
  clearSession(); 
  window.location.href = "index.html";
}

/**
 * @returns {{role: string} | null} La sesión activa, o null si redirigió.
 */
function requireSession() {
  const session = getSession(); 

  if (session === null) {
    window.location.href = "index.html";
    return null;
  }

  return session;
}