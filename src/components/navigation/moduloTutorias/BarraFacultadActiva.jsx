import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useFacultadActiva } from '../../../context/FacultadActivaContext';
import { ROL } from '../../../constants/roles';

// Barra fija que ve SOLO el super admin cuando está dentro del panel de una facultad.
// Al admin normal no le renderiza nada.
export default function BarraFacultadActiva() {
  const navigate = useNavigate();
  const { rol } = useAuth();
  const { facultadActiva, salir } = useFacultadActiva();

  if (rol !== ROL.SUPER_ADMIN || !facultadActiva) return null;

  const handleVolver = () => {
    salir();
    navigate('/superadmin/facultades', { replace: true });
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-[#EBD9B4] px-3 py-1.5 text-sm text-[#5C4A1E]">
      <span className="min-w-0 flex-1 truncate">
        Estás viendo: <strong>{facultadActiva.siglas}</strong>
        <span className="hidden sm:inline"> · {facultadActiva.nombre}</span>
      </span>
      <Button
        size="small"
        onClick={handleVolver}
        startIcon={<ArrowBackIcon fontSize="small" />}
        sx={{ textTransform: 'none', color: '#5C4A1E', fontWeight: 600, whiteSpace: 'nowrap' }}
      >
        Volver al panel principal
      </Button>
    </div>
  );
}
