import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Box, Card, CardContent, Typography } from '@mui/material';
import ChipAccion from './ChipAccion';

// Todas las tarjetas miden lo mismo: cada línea ocupa siempre su espacio (con "—" si no hay valor)
// y el texto largo se corta con "…" al llegar a su máximo de renglones.
const ALTO_LINEA = 22; // px
const ALTO_TARJETA = 264; // px: 7 renglones de texto + separaciones + acción
// Sin la línea de Facultad (bitácora del admin, que ya es de su facultad) la tarjeta es una línea más baja
const ALTO_TARJETA_SIN_FACULTAD = ALTO_TARJETA - ALTO_LINEA - 6; // 6 px = separación entre líneas

// Línea con ícono, etiqueta en negritas y valor (Afectado:, Realizado por:, Fecha...).
function LineaDato({ icono, etiqueta, valor, lineas = 1 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>{icono}</Box>
      <Typography
        sx={{
          fontSize: '15px',
          lineHeight: `${ALTO_LINEA}px`,
          height: `${ALTO_LINEA * lineas}px`,
          color: '#333333',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: lineas,
          overflowWrap: 'anywhere',
          minWidth: 0,
        }}
      >
        <span className="font-bold">{etiqueta}: </span>
        {valor || '—'}
      </Typography>
    </Box>
  );
}

// Versión móvil de una fila de la bitácora. Solo muestra.
// Misma forma que las demás tarjetas del super admin: arriba la acción y abajo los datos con su etiqueta.
// siglasFacultad es opcional: si no se manda (bitácora del admin) no se muestra la línea de Facultad.
export default function TarjetaBitacora({ registro, siglasFacultad, fecha }) {
  const { accion, entidad, detalle, usuario } = registro;
  const conFacultad = siglasFacultad !== undefined;

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '400px',
        background: '#FFFFFF',
        borderLeft: '20px solid #08338F',
        borderRadius: '5px',
        boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',
        height: `${conFacultad ? ALTO_TARJETA : ALTO_TARJETA_SIN_FACULTAD}px`,
      }}
    >
      <CardContent sx={{ padding: '24px 24px 20px !important' }}>
        <Box sx={{ mb: 2 }}><ChipAccion accion={accion} /></Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <LineaDato icono={<DescriptionOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Afectado" valor={entidad} lineas={2} />
          <LineaDato icono={<InfoOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Detalle" valor={detalle} lineas={2} />
          <LineaDato icono={<PersonOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Realizado por" valor={usuario} />
          <LineaDato icono={<AccessTimeIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha" valor={fecha} />
          {conFacultad && (
            <LineaDato icono={<SchoolOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Facultad" valor={siglasFacultad} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
