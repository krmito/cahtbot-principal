"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var request = require("request");
var User_1 = require("./classes/User");
var consultaAfiliadoEPS = require("./services/consultaAfiliadoEPS");
var constants_1 = require("./classes/constants");
var app = require('express')();
var FileReader = require('filereader');
var File = require("file-class");
var messageTosendRiesgo = require("./classes/messageTosendRiesgo");
var messageTosend = require("./classes/messagesToSend");
var messageTosendMain = require("./classes/messagesToSendMain");
var utilities = require("./classes/utilities");
var constants = require("./classes/constants");
var consultaLogin = require("./services/login");
var url = 'https://eu24.chat-api.com/instance23630/sendMessage?token=fhbjhwk1fvtfy2j4';
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
        if (!element.fromMe && element.author != '573225964155@c.us') {
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
        messageToSendRE = messageTosendMain.newMessage('menu', userNameRE);
        user = new User_1.User(phoneRE, messageToSendRE, 'menu');
        console.log("phoneRE: " + phoneRE);
        users.set(phoneRE, user);
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'menu' && siga == true && constants_1.main.LI.find(function (valueLI) { return utilities.isContain(messageRE, valueLI); })) {
        //Flujo LI
        messageToSendRE = messageTosend.newMessage('saludoInicialLI', userNameRE);
        user.state = 'saludoInicialLI';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'menu' && siga == true && constants_1.main.RE.find(function (valueRE) { return utilities.isContain(messageRE, valueRE); })) {
        //Flujo RE
        messageToSendRE = messageTosendRiesgo.newMessage('saludoInicialRE', userNameRE);
        user.state = 'saludoInicialRE';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    /*Flujo LI
        ------------------------------------------------------------------------------
    */
    if (user.state == 'saludoInicialLI' && siga == true && constants_1.constantsLI.afiliacion.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        messageToSendRE = messagesToSend.newMessage('afiliacionTipoDoc', userNameRE);
        user.state = 'afiliacionTipoDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'afiliacionTipoDoc' && siga == true && constants_1.constantsLI.afiliacionTipoDoc.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        messageToSendRE = messagesToSend.newMessage('afiliacionNumDoc', userNameRE);
        user.state = 'afiliacionNumDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'afiliacionNumDoc' && siga == true && !messageRE.match(/([a-zA-Z])/g)) {
        documentNumber = parseInt(messageRE);
        utilities.functionWithCallBack(consultarServicio("CC", documentNumber), 4000).then(function (res) {
            if (JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado != undefined) {
                var afiliado = JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado;
                var calidadAfiliado = afiliado.calidadAfiliado;
                var fechaAfiliacion = afiliado.fechaAfiliacionSistema;
                var fechaNacimiento = afiliado.fechaNacimiento;
                var tipoAfiliado = afiliado.tipoAfiliado;
                var estado = afiliado.activo;
                correo = afiliado.email;
                if (!correo) {
                    correo = correo.replace(correo.substring(0, 4), '*******');
                }
                var object = { calidad: calidadAfiliado, fechaA: fechaAfiliacion, fechaN: fechaNacimiento, tipo: tipoAfiliado, activo: estado };
                existeAfiliado = true;
                messageToSendRE = messagesToSend.newMessage('afiliacionRespu1', userNameRE, '', '', object, correo);
                user.state = 'afiliacionRespu1';
                user.body = messageToSendRE;
                utilities.functionWithCallBack(sendMessage(user), 1000).then(function (res) {
                    byeMessage(phoneRE, userNameRE, messageRE);
                });
            }
            else {
                existeAfiliado = false;
                messageToSendRE = messagesToSend.newMessage('afiliacionRespu2', userNameRE, String(documentNumber));
                user.state = 'afiliacionNumDoc';
                user.body = messageToSendRE;
                utilities.functionWithCallBack(sendMessage(user), 1000).then(function (res) {
                    byeMessage(phoneRE, userNameRE, messageRE);
                });
            }
        });
    }
    else if (user.state == 'despedida1' && siga == true && constants_1.constantsLI.no.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        byeMessage(phoneRE, userNameRE, messageRE);
    }
    else if (user.state == 'despedida1' && siga == true && constants_1.constantsLI.si.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        byeMessage(phoneRE, userNameRE, messageRE);
    }
    else if (user.state == 'saludoInicial' && siga == true && constants_1.constantsLI.certificados.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        messageToSendRE = messagesToSend.newMessage('certificadoTipo', userNameRE);
        user.state = 'certificadoTipo';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'certificadoTipo' && siga == true && constants_1.constantsLI.certificadosTipo.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        messageToSendRE = messagesToSend.newMessage('certificadoTipoDoc', userNameRE);
        user.state = 'certificadoTipoDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'certificadoTipoDoc' && siga == true && constants_1.constantsLI.certificadosDoc.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
        messageToSendRE = messagesToSend.newMessage('certificadoNumDoc', userNameRE);
        user.state = 'certificadoNumDoc';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'certificadoNumDoc' && siga == true && !messageRE.match(/([a-zA-Z])/g)) {
        user.state = 'sentPdf';
        user.filename = 'certificado.pdf';
        user.body = pdfFileUrl;
        user.caption = userNameRE + ' este es tu certificado';
        utilities.functionWithCallBack(sendFile(user).then(function (res) {
            if (res) {
                siga = true;
            }
        }), 1000).then(function (res) {
            byeMessage(phoneRE, userNameRE, messageRE);
        });
    }
    else if (user.state == 'saludoInicial' && siga == true && constants_1.constantsLI.pagosEnLinea.find(function (value) { return utilities.isContain(messageRE, value); })) {
        messageToSendRE = messagesToSend.newMessage('pagosEnLinaTipo', userNameRE);
        user.state = 'pagosEnLinaTipo';
        user.body = messageToSendRE;
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    else if (user.state == 'pagosEnLinaTipo' && siga == true && constants_1.constantsLI.pagosEnLineaTipo.find(function (value) { return utilities.isContain(messageRE, value); })) {
        messageToSendRE = messagesToSend.newMessage('pagosEnLinaTipo', userNameRE);
        user.state = 'link';
        user.body = messageToSendRE + ' https://www.banco.colpatria.com.co/PagosElectronicos/Referencias.aspx';
        utilities.functionWithCallBack(sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        }), 1000).then(function (res) {
            byeMessage(phoneRE, userNameRE, messageRE);
        });
    }
    else if (constants_1.constantsLI.cancelar.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); }) && siga == true) {
        switch (user.state) {
            case 'saludoInicial':
                user.state = 'cancelarInicial';
                byeMessage(phoneRE, userNameRE, messageRE);
                break;
            case 'afiliacionTipoDoc':
                messageToSendRE = messagesToSend.newMessage('saludoInicial', userNameRE);
                user.state = 'saludoInicial';
                user.body = messageToSendRE;
                sendMessage(user).then(function (res) {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'afiliacionNumDoc':
                messageToSendRE = messagesToSend.newMessage('afiliacionTipoDoc', userNameRE);
                user.state = 'afiliacionTipoDoc';
                user.body = messageToSendRE;
                sendMessage(user).then(function (res) {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'certificadoTipo':
                messageToSendRE = messagesToSend.newMessage('saludoInicial', userNameRE);
                user.state = 'saludoInicial';
                user.body = messageToSendRE;
                sendMessage(user).then(function (res) {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'certificadoTipoDoc':
                messageToSendRE = messagesToSend.newMessage('certificadoTipo', userNameRE);
                user.state = 'certificadoTipo';
                user.body = messageToSendRE;
                sendMessage(user).then(function (res) {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'certificadoNumDoc':
                messageToSendRE = messagesToSend.newMessage('certificadoTipoDoc', userNameRE);
                user.state = 'certificadoTipoDoc';
                user.body = messageToSendRE;
                sendMessage(user).then(function (res) {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            case 'pagosEnLinaTipo':
                messageToSendRE = messagesToSend.newMessage('saludoInicial', userNameRE);
                user.state = 'saludoInicial';
                user.body = messageToSendRE;
                sendMessage(user).then(function (res) {
                    if (res) {
                        siga = true;
                    }
                });
                break;
            default:
                break;
        }
    }
    else if (siga == true) {
        var noEntiendoMessage = '';
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
        sendMessage(user).then(function (res) {
            if (res) {
                siga = true;
            }
        });
    }
    /* //Flujo RE
        --------------------------------------------------------------------------------------------------------
    */
    if (user.state == 'saludoInicialRE' && siga == true && constants_1.constantsRE.reporteRiesgo.find(function (valueSaludo1) { return utilities.isContain(messageRE, valueSaludo1); })) {
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
        if (constants_1.constantsRE.rios.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.incendios.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.invasion.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.teleEner.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.calles.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.saludTran.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.seguRobo.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.sismo.find(function (response) { return utilities.isContain(messageRE, response); }) ||
            constants_1.constantsRE.otros.find(function (response) { return utilities.isContain(messageRE, response); })) {
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
        if (constants_1.constantsRE.si.find(function (valueRepetir) { return valueRepetir == messageRE; })) {
            messageToSendRE = messageTosendRiesgo.newMessage('saludoInicial', messageRE);
            user.state = 'saludoInicialRE';
            user.body = messageToSendRE;
            sendMessage(user).then(function (res) {
                if (res) {
                    siga = true;
                }
            });
        }
        else if (constants_1.constantsRE.no.find(function (valueRepetir) { return valueRepetir == messageRE; })) {
            //message = messagesTosendRiesgo.newMessage('repetir', senderName);
            user.state = 'saludoInicialRE';
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
function loguearse() {
    consultaLogin.acceso.armaObjetos("", 0, function (x) {
        datos = JSON.parse(x);
        console.log("Datos:----> " + datos.data.token);
    });
}
var server = app.listen(process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("El servidor se encuentra en el puerto " + port + " y el host es " + host);
});
