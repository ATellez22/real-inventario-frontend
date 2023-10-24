import axios,  { AxiosRequestConfig, AxiosError } from 'axios';
import Swal from 'sweetalert2'

// // Interceptor de solicitud antes de enviarla
// axios.interceptors.request.use(
//   function (config) {
//     // Cuando la solicitud es enviada
//     return config;
//   },
//   function (error) {
//     // Manejo de error    
//     return Promise.reject(error);
//   }
// );

// //Interceptor de respuesta tras recibir la respuesta 
// axios.interceptors.response.use(
//   function (response) {
//     // Cualquier código de estado que se encuentre dentro del rango de 2xx hace que se active esta función
//     return response;
//   },
//   function (error) {
//     // Cualquier código de estado que quede fuera del rango de 2xx hace que se active esta función
//     // Detener el flujo de la solicitud aquí
//     return Promise.reject(error);
//     //console.error('Error de Respuesta:', error.message);
//     //throw error; // Lanza una excepción para detener el flujo de respuesta
//   }
// );


// Función para realizar una solicitud con reintentos
const MAX_RETRIES = 1; 

const fetchWithRetries = async (config: AxiosRequestConfig, retries: number): Promise<any> => {
 
  try {
    const response = await axios(config);   
    return response.data;   
  } catch (error:any) {   
    if (retries < 4 && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')) { // Reintento solo para errores de tiempo de espera
    
      Swal.fire({
        title: 'Reintentando envio...: '+ retries + " de 5",
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      });

      return fetchWithRetries(config, retries + 1); // Reintento recursivo
    } else {           
      return "Error de conexion";      
    }
  } 
}

export const fetchApi = async (path: string, method: string = 'GET', data: any = null) => {
  const url = `http://192.168.2.174:8082/real-inventario-backend/public/${path}`;

  const config: AxiosRequestConfig = {
    method,
    url,
    data, // Los datos que se enviarán en el cuerpo de la solicitud POST
    timeout: 2000, // Tiempo de espera de respuesta   
  };

  try {
    // Llamamos a la función de reintento con el número máximo de intentos
    return await fetchWithRetries(config, MAX_RETRIES);
  } catch (error:any) {
    // Puedes manejar otros errores aquí si es necesario
    //alert(`Se agotaron todos los intentos. Error: ${error.message}`);
    throw error;
  }
};


/*
200 OK: La solicitud se ha completado correctamente y se ha devuelto la respuesta solicitada.
201 Created: La solicitud ha tenido éxito y se ha creado un nuevo recurso en el servidor.
204 No Content: La solicitud se ha completado con éxito, pero no se ha devuelto contenido en la respuesta.
*/