import { Fragment } from 'react';

// Las direcciones que empiezan con http:// o https:// se vuelven enlaces; el resto del texto queda igual.
// Con el paréntesis de captura, split deja las direcciones en las posiciones impares del arreglo.
const REGEX_URL = /(https?:\/\/[^\s]+)/g;

// Signos que suelen pegarse al final de un enlace dentro de una frase ("mira https://x.com/a.") y no son parte de él
const REGEX_PUNTUACION_FINAL = /^(.*?)([.,;:!?)\]]*)$/;

// Muestra un texto con sus enlaces clicables (se abren en una pestaña nueva).
// propio: true si el mensaje va en la burbuja azul (enlace blanco); si no, el enlace va en azul.
export default function TextoConEnlaces({ texto = '', propio = false }) {
    const partes = texto.split(REGEX_URL);

    return partes.map((parte, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{parte}</Fragment>;

        const [, direccion, puntuacion] = parte.match(REGEX_PUNTUACION_FINAL);

        return (
            <Fragment key={i}>
                <a
                    href={direccion}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: propio ? '#ffffff' : '#1565C0', textDecoration: 'underline' }}
                    // El clic en el enlace no debe disparar nada del contenedor
                    onClick={(e) => e.stopPropagation()}
                >
                    {direccion}
                </a>
                {puntuacion}
            </Fragment>
        );
    });
}
