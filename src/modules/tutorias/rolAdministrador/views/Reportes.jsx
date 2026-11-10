// rolAdministrador/views/Reportes.jsx
// Reportes por estudiante, grupo y licenciatura: el parámetro `tipo` viene de la ruta (ver App.jsx).
// La `key` hace que al cambiar de reporte se empiece de cero (filtros y resultados).
import ReporteAgrupado from './ReporteAgrupado';

export default function Reportes({ tipo }) {
    return <ReporteAgrupado key={tipo} tipo={tipo} />;
}
