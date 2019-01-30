"use strict";
var messagesToSend = {
    newMessage: function (state, userName, documento, x, objecto, correo) {
        var mensaje = '';
        switch (state) {
            case 'saludoInicialLI':
                mensaje = "Hola " + userName + ", Bienvenido a la l\u00EDnea de atenci\u00F3n de *Comfenalco Valle*.\n\u00BFQu\u00E9 deseas realizar? (indica el c\u00F3digo).\n      *(AF) Estado de Afiliaci\u00F3n* \n      *(CE) Certificados*  \n      *(PA) Pagos en L\u00EDnea* \n      *(SU) Subsidios*\n      *(PR) Preafiliaci\u00F3n*\n      *(YA) Yanaconas*\n      *(VA) Valle del Lili*\n      *(PQ) PQR'S*  \n      *(CA) Cancelar*";
                break;
            case 'afiliacionTipoDoc':
                mensaje = userName + " digita el tipo de documento por favor \n      *(CC) C\u00E9dula de Ciudadan\u00EDa*\n      *(CE) C\u00E9dula de Extranjer\u00EDa* \n      *(CA) Cancelar* ";
                break;
            case 'afiliacionNumDoc':
                mensaje = "Muy bien " + userName + ", ahora digita el n\u00FAmero de tu documento (Ejemplo: 1144256257) o digita\n        *(CA) Cancelar*";
                break;
            case 'afiliacionRespu1':
                objecto.activo = objecto.activo == 'S' ? 'Activo' : 'Inactivo';
                mensaje = "*" + userName + "* se ha verificado tu documento exitosamente, \n        *tu calidad de afiliado es:* " + objecto.calidad + ",\n        *tu fecha de nacimiento:* " + objecto.fechaN + ",\n        *tu fecha de afiliaci\u00F3n:* " + objecto.fechaA + ",\n        *tu estado actual es:* " + objecto.activo + ".";
                break;
            case 'afiliacionRespu2':
                mensaje = userName + " un usuario con el n\u00FAmero de documento *" + documento + "* no existe, por favor intenta de nuevo o digita \n        *(CA) Cancelar*";
                break;
            case 'certificadoTipo':
                mensaje = userName + " \u00BFqu\u00E9 tipo de certificado de afiliaci\u00F3n quieres?: \n        *(AF) Certificado Afiliaci\u00F3n individual*\n        *(SF) Extracto Subsidio Familiar* \n        *(CR) Certificado Afiliaci\u00F3n Retirado* \n        *(CA) Cancelar*";
                break;
            case 'certificadoTipoDoc':
                mensaje = userName + " digita el tipo de documento por favor \n        *(CC) C\u00E9dula de Ciudadan\u00EDa*\n        *(CE) C\u00E9dula de Extranjer\u00EDa* \n        *(CA) Cancelar*";
                break;
            case 'certificadoNumDoc':
                mensaje = "Muy bien " + userName + ", ahora digita el n\u00FAmero de tu documento (Ejemplo: 1144256257) o digita CA para volver\n        *(CA) Cancelar*";
                break;
            case 'pagosEnLinaTipo':
                mensaje = userName + " por favor indica si eres Empresa o Persona natural.\n      *(EM) Empresas*\n      *(PE) Personas*\n      *(CA) Cancelar*";
                break;
            case 'pagosEnLinaLink':
                mensaje = userName + " puedes dar click en este link para realizar el pago";
                break;
            case 'noEntiendo':
                mensaje = userName + " por favor utiliza una de las opciones.";
                break;
            case 'despedida1':
                mensaje = "Gracias " + userName + ", te puedo ayudar en algo m\u00E1s\n      *(S) Si*\n      *(N) No*";
                break;
            case 'despedida2':
                mensaje = userName + " necesitas ayuda con algo m\u00E1s \n      *(S) Si*\n      *(N) No*";
                break;
        }
        return mensaje;
    }
};
module.exports = messagesToSend;
