import $ from 'jquery';

export const Scan = () => {
  // Suponga que una pérdida de enfoque significa que el valor ha terminado de ingresarse
  let inputStart:any, inputStop:any, firstKey:any, lastKey:any, timing:any, userFinishedEntering:any;
  let minChars = 3;
  const txtCod:any = $("#txt_codigo");
  const txtCan:any = $("#txt_cantidad");

  $("#txt_codigo").keypress(function(e) {
      // reiniciar el temporizador
      if (timing) {
          clearTimeout(timing);
      }

      // manejar el evento clave
      if (e.which == 13) {
          // Se ingresó la clave

          //no enviar el formulario
          e.preventDefault();

          // ¿El usuario ha terminado de ingresar manualmente?
          if (txtCod.val().length >= minChars) {
              userFinishedEntering = true; // En caso de que la usuario presione la tecla enter
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
              $("body").on("blur", "#txt_cod", inputBlur);
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

  // reinicia la pagina
  $("#reset").click(function(e) {
      e.preventDefault();
      resetValues();
  });

  function resetValues() {
      // limpiar variables
      inputStart = null;
      inputStop = null;
      firstKey = null;
      lastKey = null;
      // limpiar resultados
      inputComplete();
  }

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
          reportValues();
      }
  }

  // aquí decidimos qué hacer ahora que sabemos que un valor ha sido ingresado por completo
  function inputComplete() {
      // deja de escuchar la entrada para perder el foco
      //$("body").off("blur", "#txt_cod", inputBlur);

      txtCan.focus(); //EL foco pasa a TXT_CAN y de ese modo se actica el evento ONBLUR del mismo input

      // informar los resultados
      reportValues();
  }

  function reportValues() {
      // actualizar las metricas
      $("#startTime").text(inputStart == null ? "" : inputStart);
      $("#firstKey").text(firstKey == null ? "" : firstKey);
      $("#endTime").text(inputStop == null ? "" : inputStop);
      $("#lastKey").text(lastKey == null ? "" : lastKey);
      $("#totalTime").text(
              inputStart == null ? "" : (inputStop - inputStart)
                      + " milliseconds");
      if (!inputStart) {
          // limpiar los resultados
          $("#resultsList").html("");
          $("#txt_cod").focus().select();
      } else {
          // anteponer otro elemento de resultado
          var inputMethod = isScannerInput() ? "Scanner" : "Keyboard";
          $("#resultsList").prepend(txtCod.val());
          $("#txt_cod").focus().select();
          inputStart = null;

      }
  }
};

