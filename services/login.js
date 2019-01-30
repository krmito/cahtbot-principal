"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormData = require('form-data');
var acceso = /** @class */ (function () {
    function acceso() {
    }
    acceso.armaObjetos = function (tipo, cedula, callback) {
        var formData = new FormData();
        formData.append("login", "mygov@nx.com");
        formData.append("password", "123456789");
        console.log("FORM-DATA: " + JSON.stringify(formData));
        var options = {
            method: "POST",
            url: "https://qa-producto.nexura.com/api/registro/login",
            port: 443,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                "login": "mygov@nx.com",
                "password": "123456789"
            }
        };
        /*         this.request.post({
                        "headers": { "content-type": "multipart/form-data" },
                        "url": this.servicio,
                        "formData": JSON.stringify(formData)
                    }, (error: any, response: any, body: any) => {
                        console.log("RESPONSE: " + JSON.stringify(response));
                        console.log("BODY: " + JSON.stringify(body));
        
                        if (!error && response.statusCode == 200) {
                            callback(body);
                        }
                        else {
                            console.log(error);
                        }
                    }); */
        this.request(options, function (error, response, body) {
            if (error)
                console.log(error);
            console.log(body);
            if (!error && response.statusCode == 200) {
                callback(body);
            }
            else {
                console.log(error);
            }
        });
    };
    acceso.servicio = "https://qa-producto.nexura.com/api/registro/login";
    acceso.cuerpo = {};
    acceso.request = require('request');
    acceso.tipoDocumento = "";
    acceso.fechaExpedicion = "";
    return acceso;
}());
exports.acceso = acceso;
