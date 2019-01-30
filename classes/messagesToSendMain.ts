let messagesToSendMain = {
  newMessage: function (state: string, userName: string, documento?: string, x?: string, objecto?: any, correo?: string) {
    let mensaje = '';


    switch (state) {
      case 'menu':
        mensaje = `Bienvenido al Demo del asistente virtual de atención de  <b>Avanti-IT SAS</b>,
por favor selecciona una de las siguientes opciones:

(LI) Líneas de atención al usuario
(RE) Reporte de riesgo y eventos
(AG) Agendamiento de citas
(PE) Pedidos por catálogo
(DO) Domicilios
(RE) Reserva de restaurantes
(PQ) PEticiones, quejas y reclamos

Ayuda: Si quieres ver líneas de atención escribe <b>LI</b>.`;
        break;
    }
    return mensaje;
  }
}

module.exports = messagesToSend;
