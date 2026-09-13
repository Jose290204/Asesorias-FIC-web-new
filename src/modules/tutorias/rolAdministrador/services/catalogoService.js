// src/services/catalogoService.js

class CatalogoService {
  constructor() {
    this.modalidades = [
      { id_modalidad: 1, modalidad: 'Presencial' },
      { id_modalidad: 2, modalidad: 'Virtual' },
    ];

    this.planesEstudio = [
      { id_plan: 1, plan_estudios: '2011' },
      { id_plan: 2, plan_estudios: '2023' },
    ];

    this.razonesAsesoria = [
      { id_razon: 1, razon: 'Parcial' },
      { id_razon: 2, razon: 'Ordinario' },
      { id_razon: 3, razon: 'Extraordinario' },
      { id_razon: 4, razon: 'Especial' },
      { id_razon: 5, razon: 'Reforzamiento' },
    ];

    this.roles = [
      { id_rol: 1, rol: 'Administrador Master' },
      { id_rol: 2, rol: 'Administrador' },
      { id_rol: 3, rol: 'Asesor disciplinar' },
      { id_rol: 4, rol: 'Estudiante' },
      { id_rol: 5, rol: 'Asesor par' },
    ];

    this.semestres = [
      { id_semestre: 1, semestre: 'SEMESTRE I' },
      { id_semestre: 2, semestre: 'SEMESTRE II' },
      { id_semestre: 3, semestre: 'SEMESTRE III' },
      { id_semestre: 4, semestre: 'SEMESTRE IV' },
      { id_semestre: 5, semestre: 'SEMESTRE V' },
      { id_semestre: 6, semestre: 'SEMESTRE VI' },
      { id_semestre: 7, semestre: 'SEMESTRE VII' },
      { id_semestre: 8, semestre: 'SEMESTRE VIII' },
      { id_semestre: 9, semestre: 'SEMESTRE IX' },
      { id_semestre: 10, semestre: 'SEMESTRE X' },
    ];

    this.materias = [
      { id_materia: 88, materia: 'Lógica de Programación y Pensamiento Computacional', id_licenciaturas: 2, id_semestre: 1 },
      { id_materia: 89, materia: 'Arquitectura de Computadoras', id_licenciaturas: 2, id_semestre: 1 },
      { id_materia: 90, materia: 'Matemáticas Discretas', id_licenciaturas: 2, id_semestre: 1 },
      { id_materia: 91, materia: 'Fundamentos de Redes', id_licenciaturas: 2, id_semestre: 1 },
      { id_materia: 92, materia: 'Introducción a la Informática', id_licenciaturas: 2, id_semestre: 1 },
      { id_materia: 93, materia: 'Laboratorio de Sistemas Operativos', id_licenciaturas: 2, id_semestre: 1 },
      { id_materia: 94, materia: 'Programación Estructurada', id_licenciaturas: 2, id_semestre: 2 },
      { id_materia: 95, materia: 'Fundamentos de Bases de Datos', id_licenciaturas: 2, id_semestre: 2 },
      { id_materia: 96, materia: 'Álgebra Lineal', id_licenciaturas: 2, id_semestre: 2 },
      { id_materia: 97, materia: 'Redes de Computadoras', id_licenciaturas: 2, id_semestre: 2 },
    ];

    this.diasSemana = [
      { id_dia: 1, dia: 'Lunes' },
      { id_dia: 2, dia: 'Martes' },
      { id_dia: 3, dia: 'Miercoles' },
      { id_dia: 4, dia: 'Jueves' },
      { id_dia: 5, dia: 'Viernes' },
      { id_dia: 6, dia: 'Sabado' },
      { id_dia: 7, dia: 'Domingo' },
    ];

    this.estatus = [
      { id_estatus: 1, estatus: 'ALTA' },
      { id_estatus: 2, estatus: 'BAJA' },
    ];

    this.estatusAsesoria = [
      { id_estatus_asesoria: 1, estatus_asesoria: 'COMPLETADA' },
      { id_estatus_asesoria: 2, estatus_asesoria: 'ELIMINADA' },
      { id_estatus_asesoria: 3, estatus_asesoria: 'EN CURSO' },
    ];

    this.estatusSolicitud = [
      { id_estatus_solicitud: 1, estatus_solicitud: 'ACEPTADA' },
      { id_estatus_solicitud: 2, estatus_solicitud: 'RECHAZADA' },
      { id_estatus_solicitud: 3, estatus_solicitud: 'EN REVISION' },
    ];

    this.grupos = [
      { id_grupo: 1, id_licenciatura: 1, grupo: '4-1' },
      { id_grupo: 2, id_licenciatura: 1, grupo: '4-2' },
      { id_grupo: 3, id_licenciatura: 1, grupo: '4-3' },
      { id_grupo: 4, id_licenciatura: 1, grupo: '4-4' },
      { id_grupo: 5, id_licenciatura: 1, grupo: '5-1' },
      { id_grupo: 6, id_licenciatura: 1, grupo: '5-2' },
      { id_grupo: 7, id_licenciatura: 1, grupo: '5-3' },
      { id_grupo: 8, id_licenciatura: 1, grupo: '5-4' },
      { id_grupo: 9, id_licenciatura: 1, grupo: '1-1' },
      { id_grupo: 10, id_licenciatura: 1, grupo: '1-2' },
      { id_grupo: 11, id_licenciatura: 1, grupo: '1-3' },
      { id_grupo: 12, id_licenciatura: 1, grupo: '1-4' },
      { id_grupo: 13, id_licenciatura: 1, grupo: '1-5' },
      { id_grupo: 14, id_licenciatura: 1, grupo: '2-1' },
      { id_grupo: 15, id_licenciatura: 1, grupo: '2-2' },
      { id_grupo: 16, id_licenciatura: 1, grupo: '2-3' },
      { id_grupo: 17, id_licenciatura: 1, grupo: '2-4' },
      { id_grupo: 18, id_licenciatura: 1, grupo: '2-5' },
      { id_grupo: 19, id_licenciatura: 1, grupo: '3-1' },
      { id_grupo: 20, id_licenciatura: 1, grupo: '3-2' },
      { id_grupo: 21, id_licenciatura: 1, grupo: '3-3' },
      { id_grupo: 22, id_licenciatura: 1, grupo: '3-4' },
      { id_grupo: 23, id_licenciatura: 1, grupo: '3-5' },
    ];

    this.licenciaturas = [
      { id_licenciatura: 1, licenciatura: 'LICENCIATURA EN INFORMATICA' },
      { id_licenciatura: 2, licenciatura: 'LICENCIATURA EN INFORMATICA MODALIDAD VIRTUAL' },
      { id_licenciatura: 3, licenciatura: 'LICENCIATURA EN INGENIERIA EN CIENCIA DE DATOS' },
      { id_licenciatura: 5, licenciatura: 'MAESTRIA EN CIENCIAS DE LA INFORMACION' },
      { id_licenciatura: 6, licenciatura: 'DOCTORADO EN CIENCIAS DE LA INFORMACION' },
      { id_licenciatura: 7, licenciatura: 'DIPLOMADO EN BIOINFORMATICA' },
      { id_licenciatura: 8, licenciatura: 'DIPLOMADO EN ADMINISTRACION DE REDES Y DESARROLLO WEB' },
      { id_licenciatura: 4, licenciatura: 'LICENCIATURA EN INGENIERÍA EN TELECOMUNICACIONES, SISTEMAS Y ELECTRÓNICA' },
    ];

    this.horarios = [
      { id_horario: 1, horario: '7:00-8:00 AM' },
      { id_horario: 2, horario: '8:00-9:00 AM' },
      { id_horario: 3, horario: '9:00-10:00 AM' },
      { id_horario: 4, horario: '10:00-11:00 AM' },
      { id_horario: 5, horario: '11:00-12:00 PM' },
      { id_horario: 6, horario: '12:00-1:00 PM' },
      { id_horario: 7, horario: '1:00-2:00 PM' },
      { id_horario: 8, horario: '2:00-3:00 PM' },
      { id_horario: 9, horario: '3:00-4:00 PM' },
      { id_horario: 10, horario: '4:00-5:00 PM' },
      { id_horario: 11, horario: '5:00-6:00 PM' },
      { id_horario: 12, horario: '6:00-7:00 PM' },
      { id_horario: 13, horario: '7:00-8:00 PM' },
      { id_horario: 14, horario: '8:00-9:00 PM' },
      { id_horario: 15, horario: '9:00-10:00 PM' },
      { id_horario: 16, horario: '10:00-11:00 PM' },
      { id_horario: 17, horario: '11:00-12:00 AM' },
    ];
  }

  getCatalogos() {
    return {
      modalidades: this.modalidades,
      plan_estudios: this.planesEstudio,
      razon_asesoria: this.razonesAsesoria,
      roles: this.roles,
      semestres: this.semestres,
      materias: this.materias,
      dias_semana: this.diasSemana,
      estatus: this.estatus,
      estatus_asesoria: this.estatusAsesoria,
      estatus_solicitud: this.estatusSolicitud,
      grupos: this.grupos,
      licenciaturas: this.licenciaturas,
      horarios: this.horarios,
    };
  }

  getModalidades() { return this.modalidades; }
  getPlanesEstudio() { return this.planesEstudio; }
  getRazonesAsesoria() { return this.razonesAsesoria; }
  getRoles() { return this.roles; }
  getSemestres() { return this.semestres; }
  getMaterias() { return this.materias; }
  getDiasSemana() { return this.diasSemana; }
  getEstatus() { return this.estatus; }
  getEstatusAsesoria() { return this.estatusAsesoria; }
  getEstatusSolicitud() { return this.estatusSolicitud; }
  getGrupos() { return this.grupos; }
  getLicenciaturas() { return this.licenciaturas; }
  getHorarios() { return this.horarios; }
}

// Exportamos la instancia única
export const catalogoService = new CatalogoService();