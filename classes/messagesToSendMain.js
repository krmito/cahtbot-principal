"use strict";
var messagesToSendMain = {
    newMessage: function (state, userName, documento, x, objecto, correo) {
        var mensaje = '';
        switch (state) {
            case 'menu':
                mensaje = "Bienvenido al Demo del asistente virtual de atenci\u00F3n de  <b>Avanti-IT SAS</b>,\npor favor selecciona una de las siguientes opciones:\n\n(LI) L\u00EDneas de atenci\u00F3n al usuario\n(RE) Reporte de riesgo y eventos\n(AG) Agendamiento de citas\n(PE) Pedidos por cat\u00E1logo\n(DO) Domicilios\n(RE) Reserva de restaurantes\n(PQ) PEticiones, quejas y reclamos\n\nAyuda: Si quieres ver l\u00EDneas de atenci\u00F3n escribe <b>LI</b>.";
                break;
        }
        return mensaje;
    }
};
module.exports = messagesToSend;
