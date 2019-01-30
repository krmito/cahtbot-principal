"use strict";
var messageTosendRiesgo = {
    newMessage: function (state, userName, dia, hora, x, objecto, correo) {
        var mensaje = '';
        switch (state) {
            case 'saludoInicial':
                mensaje = "Bienvenido " + userName + " a la linea de reporte de incidentes y \n            riesgos de la Alcald\u00EDa de Cali, cuentenos que quiere hacer:\n            \n        * Si quieres reportar un riesgo, escribe R o riesgo\n        * Si quieres consultar riesgos en tu zona, escribe C o Consulta";
                break;
            case 'DescReporte':
                mensaje = "Por favor " + userName + " describe brevemente el riesgo que ves:";
                break;
            case 'cargarImagen':
                mensaje = "Por favor " + userName + "  envia una imagen del riesgo que ves";
                break;
            case 'darUbicacion':
                mensaje = "Por favor  " + userName + "  envianos tu ubicacion";
                break;
            case 'darCategoria':
                mensaje = "Por favor  " + userName + "  indica la categoria del riesgo:\n\n                1. Rios, alcantarillado, canales de agua o inundaciones\n                2. Incendios\n                3. Invasi\u00F3n en zonas no permitidas\n                4. Energ\u00EDa, cableado, Postes de luz, telefon\u00EDa o Televisi\u00F3n\n                5. Edificicaciones, viviendas, calles o estructuras en mal estado\n                6. Accidentes de tr\u00E1nsito, problemas de salud \n                7. Seguridad y justicia, robos, ri\u00F1as o atentados.\n                8. Deslizamientos de tierra, sismos\n                9. Otros";
                break;
            case 'darGracias':
                mensaje = "Gracias  " + userName + "  por reportar el evento, de inmediato avisaremos a las autoridades competentes.";
                break;
            case 'repetirRiesgo':
                mensaje = " " + userName + " deseas hacer alg\u00FAna otra operaci\u00F3n? (si / no)";
                break;
            case 'imagenValida':
                mensaje = " " + userName + ", ingresa una imagen v\u00E1lida";
                break;
            case 'ubicacionValida':
                mensaje = " " + userName + ", ingresa una ubicaci\u00F3n v\u00E1lida";
                break;
            case 'cateValida':
                mensaje = " " + userName + ", ingresa una categor\u00EDa v\u00E1lida";
                break;
        }
        return mensaje;
    }
};
module.exports = messageTosendRiesgo;
