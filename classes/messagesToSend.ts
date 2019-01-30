let messagesToSend = {
  newMessage: function (state: string, userName: string, documento?: string, x?: string, objecto?: any, correo?: string) {
    let mensaje = '';


    switch (state) {
      case 'saludoInicialLI':
        mensaje = `Hola ${userName}, Bienvenido a la línea de atención de *Comfenalco Valle*.
¿Qué deseas realizar? (indica el código).
      *(AF) Estado de Afiliación* 
      *(CE) Certificados*  
      *(PA) Pagos en Línea* 
      *(SU) Subsidios*
      *(PR) Preafiliación*
      *(YA) Yanaconas*
      *(VA) Valle del Lili*
      *(PQ) PQR'S*  
      *(CA) Cancelar*`;
        break;
      case 'afiliacionTipoDoc':
        mensaje = `${userName} digita el tipo de documento por favor 
      *(CC) Cédula de Ciudadanía*
      *(CE) Cédula de Extranjería* 
      *(CA) Cancelar* `;
        break;
      case 'afiliacionNumDoc':
        mensaje = `Muy bien ${userName}, ahora digita el número de tu documento (Ejemplo: 1144256257) o digita
        *(CA) Cancelar*`;
        break;
      case 'afiliacionRespu1':
        objecto.activo = objecto.activo == 'S' ? 'Activo' : 'Inactivo';
        mensaje = `*${userName}* se ha verificado tu documento exitosamente, 
        *tu calidad de afiliado es:* ${objecto.calidad},
        *tu fecha de nacimiento:* ${objecto.fechaN},
        *tu fecha de afiliación:* ${objecto.fechaA},
        *tu estado actual es:* ${objecto.activo}.`;
        break;
      case 'afiliacionRespu2':
        mensaje = `${userName} un usuario con el número de documento *${documento}* no existe, por favor intenta de nuevo o digita 
        *(CA) Cancelar*`;
        break;
      case 'certificadoTipo':
        mensaje = `${userName} ¿qué tipo de certificado de afiliación quieres?: 
        *(AF) Certificado Afiliación individual*
        *(SF) Extracto Subsidio Familiar* 
        *(CR) Certificado Afiliación Retirado* 
        *(CA) Cancelar*`;
        break;
      case 'certificadoTipoDoc':
        mensaje = `${userName} digita el tipo de documento por favor 
        *(CC) Cédula de Ciudadanía*
        *(CE) Cédula de Extranjería* 
        *(CA) Cancelar*`;
        break;
      case 'certificadoNumDoc':
        mensaje = `Muy bien ${userName}, ahora digita el número de tu documento (Ejemplo: 1144256257) o digita CA para volver
        *(CA) Cancelar*`;
        break;
      case 'pagosEnLinaTipo':
        mensaje = `${userName} por favor indica si eres Empresa o Persona natural.
      *(EM) Empresas*
      *(PE) Personas*
      *(CA) Cancelar*`;
        break;
      case 'pagosEnLinaLink':
        mensaje = `${userName} puedes dar click en este link para realizar el pago`;
        break;
      case 'noEntiendo':
        mensaje = `${userName} por favor utiliza una de las opciones.`;
        break;
      case 'despedida1':
        mensaje = `Gracias ${userName}, te puedo ayudar en algo más
      *(S) Si*
      *(N) No*`;
        break;
      case 'despedida2':
        mensaje = `${userName} necesitas ayuda con algo más 
      *(S) Si*
      *(N) No*`;
        break;
    }
    return mensaje;
  }
}

module.exports = messagesToSend;
