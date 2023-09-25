//Separador de miles (#.###.###)
export const formatNumber = (value: string) => {
    const Number = value.replace(/\D/g, ''); // Eliminar todos los caracteres que no sean dígitos
    const formattedNumber = Number.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agregar puntos separadores cada 3 dígitos
    return formattedNumber;
};


//Formato de teléfono (####-###-###)
export const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, ''); // Eliminar todos los caracteres que no sean dígitos
  
    // Formatear como cuatro dígitos al principio y luego un guión por cada tres números
    let formattedPhoneNumber = phoneNumber.slice(0, 4);
    const remainingDigits = phoneNumber.slice(4);
    for (let i = 0; i < remainingDigits.length; i += 3) {
      formattedPhoneNumber += '-' + remainingDigits.slice(i, i + 3);
    }
  
    return formattedPhoneNumber;
  };
