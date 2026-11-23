import * as XLSX from 'xlsx';
import api from './api';

// Columnas de la plantilla (hoja "Alumnos"), en este orden
const COLUMNAS = ['nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'numero_cuenta', 'grupo', 'password', 'num_cel'];

// Límites: el backend acepta hasta 1000 filas por validación y se crean de 25 en 25 (el hash de la contraseña tarda)
export const MAX_FILAS_CARGA = 1000;
const TAMANO_LOTE = 25;

// Lee la hoja "Alumnos" (o la primera si no existe) y regresa las filas con datos como
// { fila (número de renglón en Excel), nombre, ..., num_cel }. Lanza Error con un mensaje claro si no es la plantilla.
export const leerExcelEstudiantes = async (archivo) => {
  const libro = XLSX.read(await archivo.arrayBuffer(), { type: 'array' });
  const hoja = libro.Sheets.Alumnos ?? libro.Sheets[libro.SheetNames[0]];
  // raw:false = todo llega como texto (así no se pierden ceros ni se vuelve número la cuenta)
  const matriz = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: false, defval: '' });

  const encabezados = (matriz[0] ?? []).slice(0, COLUMNAS.length).map((c) => String(c).trim().toLowerCase());
  if (COLUMNAS.some((c, i) => encabezados[i] !== c)) {
    throw new Error(`El archivo no es la plantilla. Los encabezados deben ser: ${COLUMNAS.join(', ')}.`);
  }

  const filas = [];
  matriz.slice(1).forEach((renglon, i) => {
    const fila = { fila: i + 2 };
    COLUMNAS.forEach((c, j) => {
      fila[c] = String(renglon[j] ?? '').trim();
    });
    if (COLUMNAS.some((c) => fila[c] !== '')) filas.push(fila);
  });

  if (filas.length === 0) throw new Error('El archivo no tiene alumnos.');
  if (filas.length > MAX_FILAS_CARGA) {
    throw new Error(`El archivo tiene ${filas.length} alumnos; el máximo es ${MAX_FILAS_CARGA} por carga.`);
  }
  return filas;
};

// POST /admin/estudiantes/carga con confirmar:false. No crea nada: solo valida todo el archivo.
// Responde { total, validas, con_errores, filas: [{ fila, estudiante, errores: [] }] } (solo las filas con error)
export const validarCargaEstudiantes = async (filas) => {
  const { data } = await api.post('/admin/estudiantes/carga', { filas, confirmar: false });
  return data.data;
};

// Crea los alumnos de las filas, de 25 en 25. onProgreso(hechas, total) se llama después de cada lote.
// Regresa { creados, errores: [{ fila, estudiante, errores }] } (errores = lo que falló al crear)
export const confirmarCargaEstudiantes = async (filas, onProgreso) => {
  let creados = 0;
  const errores = [];

  for (let i = 0; i < filas.length; i += TAMANO_LOTE) {
    const lote = filas.slice(i, i + TAMANO_LOTE);
    const { data } = await api.post('/admin/estudiantes/carga', { filas: lote, confirmar: true });
    creados += data.data.creados;
    errores.push(...data.data.filas);
    onProgreso?.(Math.min(i + TAMANO_LOTE, filas.length), filas.length);
  }

  return { creados, errores };
};
