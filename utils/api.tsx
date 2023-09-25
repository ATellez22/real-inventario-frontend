import axios from 'axios';

export const fetchApi = async (path: string, method: string = 'GET', data: any = null) => {
  try {
   
    const url = `http://localhost:8000/api/${path}`;

    const config = {
      method,
      url,
      data, // Los datos que se enviarán en el cuerpo de la solicitud POST
    };

    const response = await axios(config);
    return response.data;
    
  } catch (error) {
    throw error;
  }
};
