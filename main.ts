import bodyParser = require('body-parser');
import request = require('request');
import { User } from "./classes/User";
import consultaAfiliadoEPS = require("./services/consultaAfiliadoEPS");
import { Base64 } from 'js-base64';
import { constantsLI, constantsRE, main } from "./classes/constants";

let app = require('express')();
let FileReader = require('filereader');
let File = require("file-class");
let messageTosendRiesgo = require("./classes/messageTosendRiesgo");
let messageTosend = require("./classes/messagesToSend");
let messageTosendMain = require("./classes/messagesToSendMain");
let utilities = require("./classes/utilities");
let constants = require("./classes/constants");


let url: string = 'https://eu11.chat-api.com/instance20204/sendMessage?token=linoijx5h4glyl4b';
let urlFile: string = 'https://eu11.chat-api.com/instance20204/sendFile?token=linoijx5h4glyl4b';
let pdfFileUrl: string = 'https://botfacebookredinson.herokuapp.com/saludo';
let objeto: any;
let pdf: any;
let siga = false;
/* let phone: string;
let message: string;
let userName: string; */
//let user: User;
let users = new Map();
let phones = new Set();
/* let messageToSend: string; */
let documentNumber: number;
let datos: any;
let correo: string;
let existeAfiliado: boolean;
let myArray: Array<any> = [];


app.use(bodyParser.json());


// Handle POST request
app.post('/my_webhook_url', (req: any, res: any) => {
    let data = req.body; // New messages in the "body" letiable

    data.messages.forEach((element: any) => {
        let userName = element.senderName;
        let phone = String(element.author).split('@')[0];
        let message = element.body;
        let messageToSend: string = '';

        if (!element.fromMe && element.author != '573116902401@c.us') {
            phones.add(phone);

            if (phones.has(phone)) {
                console.log('phonese', phones);
                console.log(element.author + ': ' + element.body); //Send it to console
                manageUsers(message, phone, userName, messageToSend);
            }
        }

    }); // For each message

    res.send('Ok'); //Response does not matter
});


function manageUsers(messageRE: string, phoneRE: string, userNameRE: string, messageToSendRE: string) {
    messageRE = messageRE.toLocaleLowerCase();
    let user = users.get(phoneRE);

    if (user == undefined) {
        messageToSendRE = messageTosendMain.newMessage('menu', userNameRE);
        user = new User(phoneRE, messageToSendRE, 'menu');
        users.set(phoneRE, user);
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }

        });
    } else if (user.state == 'menu' && siga == true && main.LI.find((valueLI: any) => utilities.isContain(messageRE, valueLI))) {
        //Flujo LI
        messageToSendRE = messageTosend.newMessage('saludoInicialLI', userNameRE);
        user.state = 'saludoInicialLI';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    } else if (user.state == 'menu' && siga == true && main.RE.find((valueRE: any) => utilities.isContain(messageRE, valueRE))) {
        //Flujo RE
        messageToSendRE = messageTosendRiesgo.newMessage('saludoInicialRE', userNameRE);
        user.state = 'saludoInicialRE';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    }


    /*Flujo LI  
        ------------------------------------------------------------------------------
    */
    if (user.state == 'saludoInicialLI' && siga == true && constantsLI.afiliacion.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        messageToSendRE = messagesToSend.newMessage('afiliacionTipoDoc', userNameRE);
        user.state = 'afiliacionTipoDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    } else if (user.state == 'afiliacionTipoDoc' && siga == true && constantsLI.afiliacionTipoDoc.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {

        messageToSendRE = messagesToSend.newMessage('afiliacionNumDoc', userNameRE);
        user.state = 'afiliacionNumDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });

    } else if (user.state == 'afiliacionNumDoc' && siga == true && !messageRE.match(/([a-zA-Z])/g)) {
        documentNumber = parseInt(messageRE);

        utilities.functionWithCallBack(consultarServicio("CC", documentNumber), 4000).then((res: any) => {

            if (JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado != undefined) {
                let afiliado = JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado;
                let calidadAfiliado = afiliado.calidadAfiliado;
                let fechaAfiliacion = afiliado.fechaAfiliacionSistema;
                let fechaNacimiento = afiliado.fechaNacimiento;
                let tipoAfiliado = afiliado.tipoAfiliado;
                let estado = afiliado.activo;
                correo = afiliado.email;
                if (!correo) {
                    correo = correo.replace(correo.substring(0, 4), '*******');
                }
                let object = { calidad: calidadAfiliado, fechaA: fechaAfiliacion, fechaN: fechaNacimiento, tipo: tipoAfiliado, activo: estado };

                existeAfiliado = true;
                messageToSendRE = messagesToSend.newMessage('afiliacionRespu1', userNameRE, '', '', object, correo);
                user.state = 'afiliacionRespu1';
                user.body = messageToSendRE;
                utilities.functionWithCallBack(sendMessage(user), 1000).then((res: any) => {
                    byeMessage(phoneRE, userNameRE, messageRE);
                });

            } else {
                existeAfiliado = false;
                messageToSendRE = messagesToSend.newMessage('afiliacionRespu2', userNameRE, String(documentNumber));
                user.state = 'afiliacionNumDoc';
                user.body = messageToSendRE;
                utilities.functionWithCallBack(sendMessage(user), 1000).then((res: any) => {
                    byeMessage(phoneRE, userNameRE, messageRE);
                });
            }
        });

    } else if (user.state == 'despedida1' && siga == true && constantsLI.no.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        byeMessage(phoneRE, userNameRE, messageRE);

    } else if (user.state == 'despedida1' && siga == true && constantsLI.si.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        byeMessage(phoneRE, userNameRE, messageRE);
    } else if (user.state == 'saludoInicial' && siga == true && constantsLI.certificados.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        messageToSendRE = messagesToSend.newMessage('certificadoTipo', userNameRE);
        user.state = 'certificadoTipo';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    } else if (user.state == 'certificadoTipo' && siga == true && constantsLI.certificadosTipo.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        messageToSendRE = messagesToSend.newMessage('certificadoTipoDoc', userNameRE);
        user.state = 'certificadoTipoDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    } else if (user.state == 'certificadoTipoDoc' && siga == true && constantsLI.certificadosDoc.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        messageToSendRE = messagesToSend.newMessage('certificadoNumDoc', userNameRE);
        user.state = 'certificadoNumDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    } else if (user.state == 'certificadoNumDoc' && siga == true && !messageRE.match(/([a-zA-Z])/g)) {

        user.state = 'sentPdf';
        user.filename = 'certificado.pdf';
        user.body = pdfFileUrl;
        user.caption = userNameRE + ' este es tu certificado'
        utilities.functionWithCallBack(sendFile(user).then(res => {
            if (res) {
                siga = true;
            }
        }), 1000).then((res: any) => {
            byeMessage(phoneRE, userNameRE, messageRE);
        });


    } else if (user.state == 'saludoInicial' && siga == true && constantsLI.pagosEnLinea.find((value: any) => utilities.isContain(messageRE, value))) {
        messageToSendRE = messagesToSend.newMessage('pagosEnLinaTipo', userNameRE);
        user.state = 'pagosEnLinaTipo';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    } else if (user.state == 'pagosEnLinaTipo' && siga == true && constantsLI.pagosEnLineaTipo.find((value: any) => utilities.isContain(messageRE, value))) {
        messageToSendRE = messagesToSend.newMessage('pagosEnLinaTipo', userNameRE);
        user.state = 'link';
        user.body = messageToSendRE + ' https://www.banco.colpatria.com.co/PagosElectronicos/Referencias.aspx';
        utilities.functionWithCallBack(sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        }), 1000).then((res: any) => {
            byeMessage(phoneRE, userNameRE, messageRE);
        });


    } else if (constantsLI.cancelar.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1)) && siga == true) {
        switch (user.state) {
            case 'saludoInicial':
                user.state = 'cancelarInicial'
                byeMessage(phoneRE, userNameRE, messageRE);
                break;
            case 'afiliacionTipoDoc':
                messageToSendRE = messagesToSend.newMessage('saludoInicial', userNameRE);
                user.state = 'saludoInicial';
                user.body = messageToSendRE;
                sendMessage(user).then(res => {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'afiliacionNumDoc':
                messageToSendRE = messagesToSend.newMessage('afiliacionTipoDoc', userNameRE);
                user.state = 'afiliacionTipoDoc';
                user.body = messageToSendRE;
                sendMessage(user).then(res => {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'certificadoTipo':
                messageToSendRE = messagesToSend.newMessage('saludoInicial', userNameRE);
                user.state = 'saludoInicial';
                user.body = messageToSendRE;
                sendMessage(user).then(res => {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'certificadoTipoDoc':
                messageToSendRE = messagesToSend.newMessage('certificadoTipo', userNameRE);
                user.state = 'certificadoTipo';
                user.body = messageToSendRE;
                sendMessage(user).then(res => {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'certificadoNumDoc':
                messageToSendRE = messagesToSend.newMessage('certificadoTipoDoc', userNameRE);
                user.state = 'certificadoTipoDoc';
                user.body = messageToSendRE;
                sendMessage(user).then(res => {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'pagosEnLinaTipo':
                messageToSendRE = messagesToSend.newMessage('saludoInicial', userNameRE);
                user.state = 'saludoInicial';
                user.body = messageToSendRE;
                sendMessage(user).then(res => {
                    if (res) {
                        siga = true;
                    }
                });
                break;

            default:
                break;
        }
    } else if (siga == true) {
        let noEntiendoMessage: string = '';
        noEntiendoMessage = messagesToSend.newMessage('noEntiendo', userNameRE);

        if (user.state == 'saludoInicial') {
            messageToSendRE = messagesToSend.newMessage('saludoInicial', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('.') + 1, messageToSendRE.length);

        }
        if (user.state == 'afiliacionTipoDoc') {
            messageToSendRE = messagesToSend.newMessage('afiliacionTipoDoc', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('favor') + 5, messageToSendRE.length);

        }
        if (user.state == 'afiliacionNumDoc') {
            messageToSendRE = messagesToSend.newMessage('afiliacionNumDoc', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('ahora') + 5, messageToSendRE.length);

        }
        if (user.state == 'certificadoTipo') {
            messageToSendRE = messagesToSend.newMessage('certificadoTipo', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf(':') + 1, messageToSendRE.length);

        }
        if (user.state == 'certificadoTipoDoc') {
            messageToSendRE = messagesToSend.newMessage('certificadoTipoDoc', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('favor') + 5, messageToSendRE.length);

        }
        if (user.state == 'certificadoNumDoc') {
            messageToSendRE = messagesToSend.newMessage('certificadoNumDoc', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('ahora') + 5, messageToSendRE.length);

        }
        if (user.state == 'pagosEnLinaTipo') {
            messageToSendRE = messagesToSend.newMessage('pagosEnLinaTipo', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('natural') + 7, messageToSendRE.length);

        }
        if (user.state == 'despedida1') {
            messageToSendRE = messagesToSend.newMessage('despedida1', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('más') + 3, messageToSendRE.length);

        }

        messageToSendRE = noEntiendoMessage + '\n' + messageToSendRE;
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });

    }


    /* //Flujo RE
        --------------------------------------------------------------------------------------------------------
    */


    if (user.state == 'saludoInicialRE' && siga == true && constantsRE.reporteRiesgo.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        messageToSendRE = messageTosendRiesgo.newMessage('DescReporte', userNameRE);
        user.state = 'DescReporte';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });
    } else if (user.state == 'DescReporte' && siga == true && messageRE.match(/([a-zA-Z])/g) || messageRE.match(/([0-9])/g)) {

        messageToSendRE = messageTosendRiesgo.newMessage('cargarImagen', userNameRE);
        user.state = 'cargarImagen';
        user.body = messageToSendRE;
        sendMessage(user).then(res => {
            if (res) {
                siga = true;
            }
        });

    } else if (user.state == 'cargarImagen') {

        if (messageRE.match(/([.])*\.(?:jpg|gif|png|jpeg)/g)) {

            messageToSendRE = messageTosendRiesgo.newMessage('darUbicacion', userNameRE);
            user.state = 'darUbicacion';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });

        } else {

            messageToSendRE = messageTosendRiesgo.newMessage('imagenValida', userNameRE);
            user.state = 'cargarImagen';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        }

    } else if (user.state == 'darUbicacion') {

        if (messageRE.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?);\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g)) {
            messageToSendRE = messageTosendRiesgo.newMessage('darCategoria', userNameRE);
            user.state = 'darCategoria';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        } else {

            messageToSendRE = messageTosendRiesgo.newMessage('ubicacionValida', userNameRE);
            user.state = 'darUbicacion';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        }
    } else if (user.state == 'darCategoria') {

        if (constantsRE.rios.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.incendios.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.invasion.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.teleEner.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.calles.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.saludTran.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.seguRobo.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.sismo.find((response: any) => utilities.isContain(messageRE, response)) ||
            constantsRE.otros.find((response: any) => utilities.isContain(messageRE, response))) {

            messageToSendRE = messageTosendRiesgo.newMessage('darGracias', userNameRE);
            user.state = 'darGracias';
            user.body = messageToSendRE;

            utilities.functionWithCallBack(sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            }), 3000).then((res: any) => {
                messageToSendRE = messageTosendRiesgo.newMessage('repetirRiesgo', userNameRE);
                user.state = 'repetirRiesgo';
                user.body = messageToSendRE;
                sendMessage(user).then(res => {
                    if (res) {
                        siga = true;
                    }
                });
            });
        } else {
            messageToSendRE = messageTosendRiesgo.newMessage('cateValida', userNameRE);
            user.state = 'darCategoria';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        }
    } else if (user.state == 'repetirRiesgo') {
        console.log("Entró a repetir");

        if (constantsRE.si.find((valueRepetir: any) => valueRepetir == messageRE)) {
            messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', messageRE);
            user.state = 'saludoInicialRE';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        } else if (constantsRE.no.find((valueRepetir: any) => valueRepetir == messageRE)) {
            //message = messagesTosendRiesgo.newMessage('repetir', senderName);
            user.state = 'saludoInicialRE';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        }
    } else if (user.state == 'despedida1' && siga == true && constants.no.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        byeMessage(phoneRE, userNameRE, messageRE);

    } else if (user.state == 'despedida1' && siga == true && constants.si.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
        byeMessage(phoneRE, userNameRE, messageRE);
    }


}

function byeMessage(phoneRE: string, userNameRE: string, messageRE: string) {
    let user = users.get(phoneRE);
    let messageToSendRE: string = '';


    if (user.state == 'afiliacionRespu1' || user.state == 'sentPdf' || user.state == 'link' || user.state == 'cancelarInicial' && siga == true) {
        user.state = 'despedida1';
        utilities.functionWithCallBack(randomMessageFun(userNameRE), 3000).then((res: string) => {

            user.body = res;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        });
    } else if (user.state == 'despedida1' && siga == true) {
        if (constants.no.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
            user.body = 'Ok hasta pronto ' + userNameRE;
            users.delete(phoneRE);
            utilities.functionWithCallBack(sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            }), 1000).then((res: any) => {
            });

        } else if (constants.si.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
            messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('.') + 1, messageToSendRE.length);
            user.state = 'saludoInicial';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        }
    }
}
function randomMessageFun(userNameRE: any) {
    myArray = [
        messageTosendRiesgo.newMessage('despedida1', userNameRE),
        messageTosendRiesgo.newMessage('despedida2', userNameRE)
    ];

    let randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
    return randomMessage;
}

function encodeBase64(filex: any) {
    // Convert file to base64 string
    return new Promise(resolve => {
        console.log('FOLE', filex);

        var reader = new FileReader();
        // Read file content on file loaded event
        reader.onload = function (event: any) {
            console.log('evnt', event);

            resolve(event.target.result);
        };

        // Convert data to base64 
        reader.readAsDataURL(filex);
    });
}





function sendMessage(data: any) {

    return new Promise(resolve => {
        request({
            url: url,
            method: "POST",
            json: data
        }, (err, data, res) => {
            resolve(res.sent);
        });
    });
}

function sendFile(data: any) {
    return new Promise(resolve => {
        request({
            url: urlFile,
            method: "POST",
            json: data
        }, (err, data, res) => {
            resolve(res.sent);
        });
    });
}

function descargaPdf(callback: any) {

    request({
        url: "http://104.198.179.226/dns/CertificadoAfiliacion20190109171415_P.pdf",
        method: "GET",
    }, (err, data, response) => {
        console.log('resp____', response);

        callback(response);
    });
/*     return response;
 */}

function consultarServicio(tipo: string, cedula: number) {
    consultaAfiliadoEPS.servicioAfiliadoEPS.armaObjetos(tipo, cedula, (x: any) => {
        datos = x;
    });
}

let server = app.listen(process.env.PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log("El servidor se encuentra en el puerto " + port + " y el host es " + host);
});