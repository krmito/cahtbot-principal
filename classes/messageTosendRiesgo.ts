let messageTosendRiesgo = {
    newMessage: function (state: string, userName: string, dia?: string, hora?: string, x?: string, objecto?: any, correo?: string) {
        let mensaje = '';


        switch (state) {
            case 'saludoInicial':
                mensaje = `Bienvenido ${userName} a la linea de reporte de incidentes y 
            riesgos de la Alcaldía de Cali, cuentenos que quiere hacer:
            
        * Si quieres reportar un riesgo, escribe R o riesgo
        * Si quieres consultar riesgos en tu zona, escribe C o Consulta`;
                break;
            case 'DescReporte':
                mensaje = `Por favor ${userName} describe brevemente el riesgo que ves:`;
                break;
            case 'cargarImagen':
                mensaje = `Por favor ${userName}  envia una imagen del riesgo que ves`;
                break;
            case 'darUbicacion':
                mensaje = `Por favor  ${userName}  envianos tu ubicacion`;
                break;
            case 'darCategoria':
                mensaje = `Por favor  ${userName}  indica la categoria del riesgo:

                1. Rios, alcantarillado, canales de agua o inundaciones
                2. Incendios
                3. Invasión en zonas no permitidas
                4. Energía, cableado, Postes de luz, telefonía o Televisión
                5. Edificicaciones, viviendas, calles o estructuras en mal estado
                6. Accidentes de tránsito, problemas de salud 
                7. Seguridad y justicia, robos, riñas o atentados.
                8. Deslizamientos de tierra, sismos
                9. Otros`;
                break;
            case 'darGracias':
                mensaje = `Gracias  ${userName}  por reportar el evento, de inmediato avisaremos a las autoridades competentes.`;
                break;
            case 'repetirRiesgo':
                mensaje = ` ${userName} deseas hacer algúna otra operación? (si / no)`;
                break;
            case 'imagenValida':
                mensaje = ` ${userName}, ingresa una imagen válida`;
                break;
            case 'ubicacionValida':
                mensaje = ` ${userName}, ingresa una ubicación válida`;
                break;
            case 'cateValida':
                mensaje = ` ${userName}, ingresa una categoría válida`;
                break;
        }
        return mensaje;
    }
}

module.exports = messageTosendRiesgo;
