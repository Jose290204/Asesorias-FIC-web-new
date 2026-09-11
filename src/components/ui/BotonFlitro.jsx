import TuneIcon from '@mui/icons-material/Tune';

export default function BotonFiltro({onClick}){

    return (
        <button onClick = {onClick} className = "flex items-center gap-2 font-bold text-gray-800 hover:text-black transition-colors">
            <TuneIcon>
                <span>Filtros</span>
            </TuneIcon>
        </button>
    );

}