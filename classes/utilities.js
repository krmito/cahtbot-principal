"use strict";
var utilities = {
    functionWithCallBack: function (functionX, timeout) {
        var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(functionX);
            }, timeout);
        });
        return promise;
    },
    isContain: function (input, value) {
        if (input.includes(value)) {
            return value;
        }
    },
    diaSemana: function (dia, mes, anio) {
        var dias = ["dom", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];
        var dt = new Date(mes + ' ' + dia + ', ' + anio + ' 12:00:00');
        console.log('DIA DE LA SEMANA QUE QUIERO OBTENER ' + dias[dt.getUTCDay()]);
        return dias[dt.getUTCDay()];
    }
};
module.exports = utilities;
