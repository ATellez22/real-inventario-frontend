import $ from 'jquery';

export const Scan = () => {
    // Suponga que una pérdida de enfoque significa que el valor ha terminado de ingresarse
    let inputStart: any, inputStop: any, firstKey: any, lastKey: any, timing: any, userFinishedEntering: any;
    let minChars = 3;
    const txtCod: any = $("#txt_codigo");
    const txtCan: any = $("#txt_cantidad");

    $(txtCod).on("keypress", function (e) {
        // reiniciar el temporizador
        if (timing) {
            clearTimeout(timing);
        }

        // manejar el evento clave
        if (e.key === "Enter") {
            // Se ingresó la clave

            //no enviar el formulario
            e.preventDefault();

            // ¿El usuario ha terminado de ingresar manualmente?
            if (txtCod.val().length >= minChars) {
                userFinishedEntering = true; // En caso de que el usuario presione la tecla enter
                inputComplete();
            }
        } else {
            // se ingresó algún otro valor clave

            // Podría ser el último caracter
            inputStop = performance.now();
            lastKey = e.which;

            // no asumas que ya está terminado
            userFinishedEntering = false;

            // ¿Es este el primer caracter?
            if (!inputStart) {
                firstKey = e.which;
                inputStart = inputStop;

                // estar atento a una pérdida de enfoque
                $("body").on("blur", txtCod, inputBlur);
            }

            // iniciar el tiempo de nuevo
            timing = setTimeout(inputTimeoutHandler, 500);
        }
    });

    function inputBlur() {
        clearTimeout(timing);
        if (txtCod.val().length >= minChars) {
            userFinishedEntering = true;
            inputComplete();
        }
    };
    
    // Suponga que es del escáner si se ingresó realmente rápido
    function isScannerInput() {
        return (((inputStop - inputStart) / txtCod.val().length) < 15);
    }

    // Determinar si el usuario está escribiendo lentamente
    function isUserFinishedEntering() {
        return !isScannerInput() && userFinishedEntering;
    }

    function inputTimeoutHandler() {
        // dejar de escuchar un evento de temporizador
        clearTimeout(timing);
        // si el valor se está ingresando manualmente y no se ha terminado de ingresar
        if (!isUserFinishedEntering() || txtCod.val().length < 3) {
            // sigue esperando la entrada
            return;
        } else {

        }
    }

    // aquí decidimos qué hacer ahora que sabemos que un valor ha sido ingresado por completo
    function inputComplete() {
        // deja de escuchar la entrada para perder el foco
        $("body").off("blur", txtCod, inputBlur);

        txtCan.focus(); //EL foco pasa a TXT_CAN y de ese modo se actica el evento ONBLUR del mismo input

    }

};

