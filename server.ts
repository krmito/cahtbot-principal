import bodyParser = require('body-parser');
import request = require('request');
import { User } from "./classes/User";
import consultaAfiliadoEPS = require("./services/consultaAfiliadoEPS");
import { Base64 } from 'js-base64';

let app = require('express')();
let FileReader = require('filereader');
let File = require("file-class");
let messageTosendRiesgo = require("./classes/messageTosendRiesgo");
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
        messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', userNameRE);
        user = new User(phoneRE, messageToSendRE, 'saludoInicial');
        users.set(phoneRE, user);
        sendMessage(user).then(res => {

            if (res) {
                siga = true;
            }

        });
    } else if (user.state == 'saludoInicial' && siga == true && constants.reporteRiesgo.find((valueSaludo1: any) => utilities.isContain(messageRE, valueSaludo1))) {
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

        if (constants.rios.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.incendios.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.invasion.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.teleEner.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.calles.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.saludTran.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.seguRobo.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.sismo.find((response: any) => utilities.isContain(messageRE, response)) ||
            constants.otros.find((response: any) => utilities.isContain(messageRE, response))) {

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

        if (constants.si.find((valueRepetir: any) => valueRepetir == messageRE)) {
            messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', messageRE);
            user.state = 'saludoInicial';
            user.body = messageToSendRE;
            sendMessage(user).then(res => {
                if (res) {
                    siga = true;
                }
            });
        } else if (constants.no.find((valueRepetir: any) => valueRepetir == messageRE)) {
            //message = messagesTosendRiesgo.newMessage('repetir', senderName);
            user.state = 'saludoInicial';
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