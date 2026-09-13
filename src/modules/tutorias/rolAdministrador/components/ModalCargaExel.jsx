import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalCargaExcel({ open, onClose, onDataLoaded }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleCargar = () => {
        if (file && onDataLoaded) {
            onDataLoaded(file);
            handleCancelar();
        }
    };

    const handleCancelar = () => {
        setFile(null); // Limpiar archivo seleccionado al cancelar
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancelar}
            sx={{
                '& .MuiPaper-root': {
                    width: '500px',
                    borderRadius: '12px',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                Carga Masiva desde Excel
                <IconButton
                    aria-label="close"
                    onClick={handleCancelar}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 3 }}>
                <Box className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        id="file-excel-input"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="file-excel-input"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <Typography variant="body2" color="textSecondary">
                            {file ? file.name : 'Haz clic o arrastra un archivo .xlsx aquí'}
                        </Typography>
                    </label>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                {/* BOTÓN CANCELAR */}
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancelar}
                >
                    Cancelar
                </Button>

                {/* BOTÓN ACEPTAR / CARGAR */}
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
                    disabled={!file}
                    onClick={handleCargar}
                >
                    Cargar
                </Button>
            </DialogActions>
        </Dialog>
    );
}