import TuneIcon from '@mui/icons-material/Tune';

export default function BotonFiltro({ onClick, disabled = false }){

    return (
        <button onClick = {onClick} disabled = {disabled} className = "flex items-center gap-2 font-bold text-gray-800 hover:text-black transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            <TuneIcon/>
                <span>Filtros</span>
            
        </button>
    );

}