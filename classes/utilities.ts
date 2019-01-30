let utilities = {
    functionWithCallBack: function (functionX: any, timeout: number) {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(functionX);
            }, timeout);
        });

        return promise;
    },
    isContain: function (input: string, value: string) {
        if (input.includes(value)) {
            return value;
        }
    },
    diaSemana: function (dia: string, mes: string, anio: string) {
        let dias = ["dom", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];
        let dt = new Date(mes + ' ' + dia + ', ' + anio + ' 12:00:00');
        console.log('DIA DE LA SEMANA QUE QUIERO OBTENER ' + dias[dt.getUTCDay()]);
        return dias[dt.getUTCDay()];
    }
}



module.exports = utilities;