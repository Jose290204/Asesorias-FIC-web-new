import api from './api';

// Avisos push (Web Push). El backend guarda una suscripción por dispositivo y usuario.
// Estados que usa la interfaz:
//  'no_soportado'     el navegador no tiene push (y no hay nada que hacer)
//  'requiere_instalar' iPhone/iPad: solo funciona con la app instalada en la pantalla de inicio
//  'denegado'         el usuario bloqueó los permisos en el navegador
//  'activo'           este dispositivo ya está suscrito
//  'inactivo'         se puede activar

const aUint8 = (base64) => {
  const relleno = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + relleno).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
};

const esIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const instalada = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

export const pushSoportado = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const suscripcionActual = async () => {
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
};

export async function estadoPush() {
  if (!pushSoportado()) return esIOS() && !instalada() ? 'requiere_instalar' : 'no_soportado';
  if (Notification.permission === 'denied') return 'denegado';
  return (await suscripcionActual()) ? 'activo' : 'inactivo';
}

// Llamar SOLO desde un clic del usuario (iOS lo exige para pedir el permiso)
export async function activarPush() {
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') throw new Error('permiso_denegado');

  const reg = await navigator.serviceWorker.ready;
  const { data } = await api.get('/push/clave');
  if (!data?.clave) throw new Error('el servidor no tiene la clave VAPID (revisa .env y config:clear)');

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: aUint8(data.clave),
      });
    } catch (e) {
      // Aquí falla, por ejemplo, un celular sin Google Play Services o una clave mal formada
      throw new Error(`el navegador no pudo suscribirse (${e.name}: ${e.message})`, { cause: e });
    }
  }

  await api.post('/push/suscripcion', sub.toJSON());
}

// Quita la suscripción del backend y del navegador. Se llama también al cerrar sesión, para que
// otra persona que use el mismo celular no reciba los avisos de quien salió.
export async function desactivarPush() {
  if (!pushSoportado()) return;
  const sub = await suscripcionActual();
  if (!sub) return;
  await api.delete('/push/suscripcion', { data: { endpoint: sub.endpoint } }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
}

// Al iniciar sesión: si este dispositivo ya tiene permiso y suscripción, se asocia al usuario
// actual (el backend reasigna el endpoint). No pide permiso ni muestra nada.
export async function sincronizarPush() {
  if (!pushSoportado() || Notification.permission !== 'granted') return;
  const sub = await suscripcionActual();
  if (sub) await api.post('/push/suscripcion', sub.toJSON()).catch(() => {});
}
