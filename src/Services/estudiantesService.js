
import api from "./api"; // 1: tu instancia de axios

// 2: GET /estudiante/perfil ya trae nombre, apellidos, correo, cuenta, grupo y estadísticas
export async function traerPerfilEstudiante() {
    const { data } = await api.get("/estudiante/perfil");
    return data.data;
}