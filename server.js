"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var request = require("request");
var User_1 = require("./classes/User");
var consultaAfiliadoEPS = require("./services/consultaAfiliadoEPS");
var app = require('express')();
var FileReader = require('filereader');
var File = require("file-class");
var messageTosendRiesgo = require("./classes/messageTosendRiesgo");
var utilities = require("./classes/utilities");
var constants = require("./classes/constants");
var url = 'https://eu11.chat-api.com/instance20204/sendMessage?token=linoijx5h4glyl4b';
var urlFile = 'https://eu11.chat-api.com/instance20204/sendFile?token=linoijx5h4glyl4b';
var pdfFileUrl = 'https://botfacebookredinson.herokuapp.com/saludo';
var objeto;
var pdf;
var siga = false;
/* let phone: string;
let message: string;
let userName: string; */
//let user: User;
var users = new Map();
var phones = new Set();
/* let messageToSend: string; */
var documentNumber;
var datos;
var correo;
var existeAfiliado;
var myArray = [];
app.use(bodyParser.json());
// Handle POST request
app.post('/my_webhook_url', function (req, res) {
    var data = req.body; // New messages in the "body" letiable
    data.messages.forEach(function (element) {
        var userName = element.senderName;
        var phone = String(element.author).split('@')[0];
        var message = element.body;
        var messageToSend = '';
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
function manageUsers(messageRE, phoneRE, userNameRE, messageToSendRE) {
    messageRE = messageRE.toLocaleLowerCase();
    var user = users.get(phoneRE);
    if (user == undefined) {
        messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', userNameRE);
        user = new User_1.User(phoneRE, messageToSendRE, 'saludoInicial');
        users.set(phoneRE, user);
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'saludoInicial' && siga == true && constants.reporteRiesgo.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        messageToSendRE = messageTosendRiesgo.newMessage('DescReporte', userNameRE);
        user.state = 'DescReporte';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'DescReporte' && siga == true && messageRE.match(/([a-zA-Z])/g) || messageRE.match(/([0-9])/g)) {
        messageToSendRE = messageTosendRiesgo.newMessage('cargarImagen', userNameRE);
        user.state = 'cargarImagen';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'cargarImagen') {
        if (messageRE.match(/([.])*\.(?:jpg|gif|png|jpeg)/g)) {
            messageToSendRE = messageTosendRiesgo.newMessage('darUbicacion', userNameRE);
            user.state = 'darUbicacion';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
        else {
            messageToSendRE = messageTosendRiesgo.newMessage('imagenValida', userNameRE);
            user.state = 'cargarImagen';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
    }
    else if (user.state == 'darUbicacion') {
        if (messageRE.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?);\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g)) {
            messageToSendRE = messageTosendRiesgo.newMessage('darCategoria', userNameRE);
            user.state = 'darCategoria';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
        else {
            messageToSendRE = messageTosendRiesgo.newMessage('ubicacionValida', userNameRE);
            user.state = 'darUbicacion';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
    }
    else if (user.state == 'darCategoria') {
        if (constants.rios.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.incendios.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.invasion.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.teleEner.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.calles.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.saludTran.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.seguRobo.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.sismo.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants.otros.find(function (response) { return utilities.isContain(messageRE, response); })) {
            messageToSendRE = messageTosendRiesgo.newMessage('darGracias', userNameRE);
            user.state = 'darGracias';
            user.body = messageToSendRE;
            utilities.functionWithCallBack(sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            }), 3000).then(function (res) {
                messageToSendRE = messageTosendRiesgo.newMessage('repetirRiesgo', userNameRE);
                user.state = 'repetirRiesgo';
                user.body = messageToSendRE;
                sendMessage(user).then(function (res) {
                    if (res) {
                        siga = true;
                    }
                });
            });
        }
        else {
            messageToSendRE = messageTosendRiesgo.newMessage('cateValida', userNameRE);
            user.state = 'darCategoria';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
    }
    else if (user.state == 'repetirRiesgo') {
        console.log("Entró a repetir");
        if (constants.si.find(function (valueRepetir) { return valueRepetir == messageRE; })) {
            messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', messageRE);
            user.state = 'saludoInicial';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
        else if (constants.no.find(function (valueRepetir) { return valueRepetir == messageRE; })) {
            //message = messagesTosendRiesgo.newMessage('repetir', senderName);
            user.state = 'saludoInicial';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
    }
    else if (user.state == 'despedida1' && siga == true && constants.no.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        byeMessage(phoneRE, userNameRE, messageRE);
    }
    else if (user.state == 'despedida1' && siga == true && constants.si.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        byeMessage(phoneRE, userNameRE, messageRE);
    }
}
function byeMessage(phoneRE, userNameRE, messageRE) {
    var user = users.get(phoneRE);
    var messageToSendRE = '';
    if (user.state == 'afiliacionRespu1' || user.state == 'sentPdf' || user.state == 'link' || user.state == 'cancelarInicial' && siga == true) {
        user.state = 'despedida1';
        utilities.functionWithCallBack(randomMessageFun(userNameRE), 3000).then(function (res) {
            user.body = res;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        });
    }
    else if (user.state == 'despedida1' && siga == true) {
        if (constants.no.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
            user.body = 'Ok hasta pronto ' + userNameRE;
            users.delete(phoneRE);
            utilities.functionWithCallBack(sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            }), 1000).then(function (res) {
            });
        }
        else if (constants.si.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
            messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', userNameRE);
            messageToSendRE = messageToSendRE.substr(messageToSendRE.indexOf('.') + 1, messageToSendRE.length);
            user.state = 'saludoInicial';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
    }
}
function randomMessageFun(userNameRE) {
    myArray = [
        messageTosendRiesgo.newMessage('despedida1', userNameRE),
        messageTosendRiesgo.newMessage('despedida2', userNameRE)
    ];
    var randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
    return randomMessage;
}
function encodeBase64(filex) {
    // Convert file to base64 string
    return new Promise(function (resolve) {
        console.log('FOLE', filex);
        var reader = new FileReader();
        // Read file content on file loaded event
        reader.onload = function (event) {
            console.log('evnt', event);
            resolve(event.target.result);
        };
        // Convert data to base64 
        reader.readAsDataURL(filex);
    });
}
function sendMessage(data) {
    return new Promise(function (resolve) {
        request({
            url: url,
            method: "POST",
            json: data
        }, function (err, data, res) {
            resolve(res.sent);
        });
    });
}
function sendFile(data) {
    return new Promise(function (resolve) {
        request({
            url: urlFile,
            method: "POST",
            json: data
        }, function (err, data, res) {
            resolve(res.sent);
        });
    });
}
function descargaPdf(callback) {
    request({
        url: "http://104.198.179.226/dns/CertificadoAfiliacion20190109171415_P.pdf",
        method: "GET",
    }, function (err, data, response) {
        console.log('resp____', response);
        callback(response);
    });
    /*     return response;
     */ 
}
function consultarServicio(tipo, cedula) {
    consultaAfiliadoEPS.servicioAfiliadoEPS.armaObjetos(tipo, cedula, function (x) {
        datos = x;
    });
}
var server = app.listen(process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("El servidor se encuentra en el puerto " + port + " y el host es " + host);
});
