"use client";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { sweetAlerMessages } from "../../sweet-alert";
import { fetchApi } from "@/utils/api";
import { Scan } from "@/utils/scanner";
import PrimeReactTable from "@/components/table";
import { Radio } from "react-loader-spinner";

const Taking = () => {
  const txtCantidadRef = useRef<HTMLInputElement | null>(null); //referencia a txt_cantidad para focus
  const txtCodigoRef = useRef<HTMLInputElement | null>(null); //referencia a txt_codigo para focus
  const txtusuarioRef = useRef<HTMLInputElement | null>(null); //referencia a txt_usuario para focus
  const [formSubmitted, setFormSubmitted] = useState(false); //para rastrear si el formulario se ha enviado.
  const [loading, setLoading] = useState(false); //indicador de carga

  const formik = useFormik({
    initialValues: {
      txt_usuario: "",
      sel_conteo: "1", //Debe valer 1 para que Formik lo guarde en caso de no tocarse el select
      txt_ubicacion: "",
      txt_codigo: "",
      txt_descripcion: "",
      txt_cantidad: "",
      uuid: uuidv4(), //UUID
    },

    validationSchema: Yup.object({
      txt_usuario: Yup.string().required("El nombre de usuario es obligatorio"),
      sel_conteo: Yup.number().required("El conteo es obligatorio"), // Cambia a string para coincidir con el valor de las opciones
      txt_ubicacion: Yup.string().required("La ubicación es obligatoria"),
      txt_codigo: Yup.number().required("El código de barra es obligatorio"),
      txt_descripcion: Yup.string().required("La descripción es obligatoria"),
      txt_cantidad: Yup.number().required("La cantidad es obligatoria"),
    }),

    validateOnChange: false, // Evita que las validaciones se activen automáticamente

    onSubmit: async (values, { setSubmitting }) => {
      let retries = 0;
      const MAX_RETRIES = 10;

      const performRequest = async () => {

        try {

          const response = await fetchApi("inventory", "POST", values);

          if (response) {
            sweetAlerMessages(response); //Mensajes de respuesta
            setFormSubmitted(true); // Después del envío exitoso, establece formSubmitted en true

            formik.setValues({
              ...formik.values, // limpiar campos
              txt_codigo: "",
              txt_descripcion: "",
              txt_cantidad: "",
            });

            if (txtCodigoRef.current) {
              (txtCodigoRef.current as HTMLInputElement).focus(); //Foco a txt_cantidad
            }

            setLoading(false); //cerrar indicador de carga en caso de estar activo tras reprocesamiento
          } else {

            if (retries < MAX_RETRIES) {
              setLoading(true); //abrir indicador de carga
              retries++;

              setTimeout(() => {
                performRequest();
              }, 1000); // Reintentar después de 1 segundo

            } else {
              alert("Se superó el número máximo de intentos.");
              setLoading(false); // Ocultar el indicador de carga una vez que la solicitud sea exitosa              
            }

          }

        } catch (error) {

          if (retries < MAX_RETRIES) {
            setLoading(true);
            retries++;

            setTimeout(() => {
              performRequest();
            }, 1000);

          } else {
            alert("Se superó el número máximo de intentos.");
            setLoading(false);           
          }

        } finally {          
          setSubmitting(false); // SetSubmitting se llama incluso en caso de error
        }
      };

      setTimeout(() => {
        setFormSubmitted(false); // Restablece formSubmitted en false luego de 3 segundos
      }, 3000);

      performRequest(); // Inicializa la solicitud
    },
  });

  useEffect(() => {    
    Scan(); //Captura de Scan de JQuery
  }, []);

  const buscar = async () => {

    if (formik.values.txt_codigo) {
      let retries = 0;
      const MAX_RETRIES = 100;

      const performRequest = async () => {

        try {

          const response = await fetchApi(`article/${formik.values.txt_codigo}`);

          if (response && response.descripcion) {

            formik.setFieldValue("txt_descripcion", response.descripcion);

            if (txtCantidadRef.current) {
              (txtCantidadRef.current as HTMLInputElement).focus();
            }

            setLoading(false);

          } else {

            if (retries < MAX_RETRIES) {
              setLoading(true);
              retries++;

              setTimeout(() => {
                performRequest();
              }, 1000); 

            } else {
              alert("Se superó el número máximo de intentos.");
              setLoading(false);                          
            }
          }

        } catch (error) {
        
          if (retries < MAX_RETRIES) {
            setLoading(true);
            retries++;

            setTimeout(() => {
              performRequest();
            }, 1000); 

          } else {
            alert("Se superó el número máximo de intentos.");
            setLoading(false);            
          }
        }
      };

      performRequest(); 

    } else {
      console.log("Campo vacío");      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form id="form" onSubmit={formik.handleSubmit}>
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-10 bg-gray-800 z-50">
            <Radio
              visible={true}
              height="100"
              width="100"
              ariaLabel="radio-loading"
              wrapperStyle={{}}
              wrapperClass="radio-wrapper"
            />
          </div>
        )}
        <div className="bg-white w-96 p-6 rounded shadow-sm">
          <h3 className="flex flex-col items-center justify-center mb-4 ">
            <span className="text-gray-700 font-bold text-2xl mb-2">
              📦 Toma de inventario
            </span>
          </h3>

          <label
            htmlFor="txt_usuario"
            className="text-gray-700 font-bold text-lg"
          >
            Usuario
          </label>
          <input
            type="text"
            className="w-full py-2 bg-gray-200 text-gray-500 px-1 outline-none mb-4 font-bold text-xl text-center uppercase"
            id="txt_usuario"
            name="txt_usuario"
            onChange={(e) => {
              // Elimina espacios en blanco mientras se escribe
              const newValue = e.target.value.trim().toUpperCase();
              formik.handleChange(e);
              formik.setFieldValue("txt_usuario", newValue);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.txt_usuario}
            maxLength={12}
            ref={txtusuarioRef}
            required
          />
          {formSubmitted &&
          formik.touched.txt_usuario &&
          formik.errors.txt_usuario ? (
            <div className="text-gray-500">{formik.errors.txt_usuario}</div>
          ) : null}

          <label
            htmlFor="sel_conteo"
            className="text-gray-700 font-bold text-lg"
          >
            Conteo
          </label>
          <select
            id="sel_conteo"
            className="w-full py-2 bg-gray-200 text-gray-500 px-1 outline-none mb-4 font-bold text-xl text-center uppercase"
            name="sel_conteo"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.sel_conteo}
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <label
            htmlFor="txt_ubicacion"
            className="text-gray-700 font-bold text-lg"
          >
            Ubicación
          </label>
          <input
            type="text"
            className="w-full py-2 bg-gray-200 text-gray-500 px-1 outline-none mb-4 font-bold text-xl text-center uppercase"
            id="txt_ubicacion"
            name="txt_ubicacion"
            onChange={(e) => {
              // Elimina espacios en blanco mientras se escribe
              const newValue = e.target.value.trim().toUpperCase();
              formik.handleChange(e);
              formik.setFieldValue("txt_ubicacion", newValue);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.txt_ubicacion}
            maxLength={9}
            required
          />
          {formSubmitted &&
          formik.touched.txt_ubicacion &&
          formik.errors.txt_ubicacion ? (
            <div className="text-gray-500">{formik.errors.txt_ubicacion}</div>
          ) : null}

          <label
            htmlFor="txt_codigo"
            className="text-gray-700 font-bold text-lg"
          >
            Código
          </label>
          <input
            type="number"
            className="w-full py-2 bg-gray-200 text-gray-500 px-1 outline-none mb-4 font-bold text-xl text-center uppercase"
            id="txt_codigo"
            name="txt_codigo"
            onChange={formik.handleChange}
            onBlur={(e) => {
              //formik.handleBlur(e); // Ejecutar el evento onBlur de Formik
              buscar(); // Ejecutar tu evento personalizado
            }}
            value={formik.values.txt_codigo}
            min="1"
            max="9999999999999"
            ref={txtCodigoRef}
            required
          />
          {formSubmitted &&
          formik.touched.txt_codigo &&
          formik.errors.txt_codigo ? (
            <div className="text-gray-500">{formik.errors.txt_codigo}</div>
          ) : null}

          <label
            htmlFor="txt_descripcion"
            className="text-gray-700 font-bold text-lg"
          >
            Descripción
          </label>
          <input
            type="text"
            className="w-full py-2 bg-gray-200 text-gray-500 px-1 outline-none mb-4 font-bold text-xl text-center uppercase"
            id="txt_descripcion"
            name="txt_descripcion"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.txt_descripcion}
            readOnly
            required
          />
          {formSubmitted &&
          formik.touched.txt_descripcion &&
          formik.errors.txt_descripcion ? (
            <div className="text-gray-500">{formik.errors.txt_descripcion}</div>
          ) : null}

          <label
            htmlFor="txt_cantidad"
            className="text-gray-700 font-bold text-lg"
          >
            Cantidad
          </label>
          <input
            type="number"
            className="w-full py-2 bg-gray-200 text-gray-500 px-1 outline-none mb-4 font-bold text-xl text-center uppercase"
            id="txt_cantidad"
            name="txt_cantidad"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.txt_cantidad}
            min="-9999"
            max="9999"
            ref={txtCantidadRef}
            required
          />
          {formSubmitted &&
          formik.touched.txt_cantidad &&
          formik.errors.txt_cantidad ? (
            <div className="text-gray-500">{formik.errors.txt_cantidad}</div>
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="submit"
              className="bg-green-600 font-bold text-lg w-full text-gray-100 py-2 rounded hover:bg-green-800 transition-colors"
              disabled={formSubmitted}
            >
              Confirmar
            </button>

            <PrimeReactTable
              usuario={formik.values.txt_usuario}
              conteo={formik.values.sel_conteo}
              codigo={formik.values.txt_codigo}
              //El codigo se envia para que al perder el foco reaccione el useEffect de la tabla y se
              //actualice.
            />
          </div>
        </div>
      </form>
    </div>
  );
};

Taking.displayName = "Taking";

export default Taking;
