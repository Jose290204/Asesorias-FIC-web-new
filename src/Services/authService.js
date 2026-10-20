import api, { pedirCookieCsrf } from './api';

// Devuelve el usuario: { id, nombre, correo, roles: [4, 3], facultad... }
// Si las credenciales son malas lanza el error de Axios, y quien llama decide qué mostrar.
export async function login(correo, password) {
  await pedirCookieCsrf(); // deja la cookie XSRF-TOKEN

  // SIN "dispositivo": así el backend abre la sesión por cookie
  const { data } = await api.post('/auth/login', { correo, password });

  return data.data; // la respuesta viene envuelta: { data: { ...usuario } }
}

// Se llama al abrir la app: ¿sigo con sesión? Si no, lanza un 401.
export async function obtenerSesion() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

// --- Recuperación de contraseña ---
// Son rutas públicas, pero los POST también exigen la cookie CSRF: quien llega directo
// a /recuperar-contrasena aún no la tiene y el primer POST daría 419.

// Paso 1: pide el código por correo (responde igual exista o no el correo)
export async function solicitarCodigo(correo) {
  await pedirCookieCsrf();
  return api.post('/auth/codigo', { correo });
}

// Paso 2: solo comprueba el código (no lo gasta)
export async function verificarCodigo(correo, codigo) {
  await pedirCookieCsrf();
  return api.post('/auth/codigo/verificar', { correo, codigo });
}

// Paso 3: cambia la contraseña (aquí sí se gasta el código)
export async function restablecerPassword(correo, codigo, password, password_confirmation) {
  await pedirCookieCsrf();
  return api.post('/auth/recuperar', { correo, codigo, password, password_confirmation });
}