import axios from 'axios';

export const fetchApi = async (path: string, method: string = 'GET', data: any = null) => {
  try {
       
    const url = `http://192.168.2.174:8082/real-inventario-backend/public/${path}`;

    const config = {
      method,
      url,
      data, // Los datos que se enviarán en el cuerpo de la solicitud POST
    };

    const response = await axios(config);
    
    return response.data;
    
  } catch (error) {
    //console.error("Error en fetchApi:", error);
    //throw error;
  }
};
