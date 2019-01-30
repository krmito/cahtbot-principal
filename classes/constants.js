"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constantsLI = Object.freeze({
    info: "INFO: ",
    si: ['s', 'si'],
    no: ['n', 'no'],
    afiliacion: ['af', 'estado de afiliación'],
    cancelar: ['ca', 'cancelar'],
    reporteRiesgo: ["r", "riesgo"],
    afiliacionTipoDoc: ['cc', 'ce', 'cédula de ciudadanía', 'cédula de extranjería'],
    certificados: ['ce', 'certificados'],
    certificadosTipo: [
        'af', 'certificado afiliación individual',
        'sf', 'extracto subsidio familiar',
        'cr', 'certificado afiliación retirado'
    ],
    certificadosDoc: ['cc', 'ce', 'cédula de ciudadanía', 'cédula de extranjería'],
    pagosEnLinea: ['pa', 'pagos en línea'],
    pagosEnLineaTipo: ['em', 'pe', 'empresas', 'personas'],
    consultaRiesgo: [["c", "consulta"]],
    saludosInicial: ["hola", "ola", "buena tarde", "buen dia", "buena noche", "qhubo"],
    tipoDocumento: [["1", "cédula de ciudadanía"], ["2", "pasaporte"], ["3", "tarjeta de identidad"], ["4", "cancelar"]],
    horasDisponibles: ["8:00", "9:00", "3:30", "4:20", "cancelar"],
});
exports.constantsRE = Object.freeze({
    info: "INFO: ",
    si: ['s', 'si'],
    no: ['n', 'no'],
    cancelar: ['ca', 'cancelar'],
    reporteRiesgo: ["r", "riesgo"],
    consultaRiesgo: [["c", "consulta"]],
    saludosInicial: ["hola", "ola", "buena tarde", "buen dia", "buena noche", "qhubo"],
    rios: ["1", "Rios", "alcantarillado", "canales de agua", "inundaciones"],
    incendios: ["2", "Incendios"],
    invasion: ["3", "Invasión en zonas no permitidas", "invasin", "invasion"],
    teleEner: ["4", "Energía", "cableado", "Postes de luz", "telefonía", "Televisión"],
    calles: ["5", "Edificicaciones", "viviendas", "calles", "estructuras en mal estado"],
    saludTran: ["6", "Accidentes de tránsito", "problemas de salud"],
    seguRobo: ["7", "Seguridad y justicia", "robos", "riñas", "atentados"],
    sismo: ["8", "Deslizamientos de tierra", "sismos"],
    otros: ["9", "otros"]
});
exports.main = Object.freeze({
    info: "INFO: ",
    LI: ['li', 'atencion al usuario', 'atención', 'atencion'],
    RE: ['re', 'gestion del riesgo', 'riesgo', 'gestion'],
});
