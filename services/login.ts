var FormData = require('form-data');
export class acceso {

    static servicio = "https://qa-producto.nexura.com/api/registro/login";
    static cuerpo = {}
    static request = require('request');
    static tipoDocumento: string = "";
    static fechaExpedicion: string = "";
    static response: any;

    constructor() { }

    static armaObjetos(tipo: string, cedula: number, callback: any): any {
        var formData = new FormData();

        formData.append("login", "mygov@nx.com");
        formData.append("password", "123456789");
        console.log("FORM-DATA: " + JSON.stringify(formData));

        const options = {
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
        this.request(options, (error: any, response: any, body: any) => {
            if (error) console.log(error);
            console.log(body);

            if (!error && response.statusCode == 200) {
                callback(body);
            }
            else {
                console.log(error);
            }
        });
    }
}