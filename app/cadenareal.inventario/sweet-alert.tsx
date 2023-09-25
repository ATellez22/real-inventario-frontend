import Swal from 'sweetalert2'

export const sweetAlerMessages = (response:number) => {

    if (response == 1) {
        Swal.fire({
            title: 'Guardado!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
        });
    } else if (response == 2) {
        Swal.fire({
            title: 'Falta el conteo 1!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 3) {
        Swal.fire({
            title: 'Actualizado!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
        });
    } else if (response == 4) {
        Swal.fire({
            title: 'Ya existe conteo 1!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 5) {
        Swal.fire({
            title: 'Ya hiciste el conteo 1!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 6) {
        Swal.fire({
            title: 'Otra persona hizo el conteo 2!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 7) {
        Swal.fire({
            title: 'Faltan los conteos 1 y 2!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 8) {
        Swal.fire({
            title: 'No puedes hacer el conteo 3!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 9) {
        Swal.fire({
            title: 'Diferencia 0. No se necesita reconteo!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 10) {
        Swal.fire({
            title: 'Otra persona hizo el reconteo!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 11) {
        Swal.fire({
            title: 'No se guardan productos inexistentes!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    } else if (response == 12) {
        Swal.fire({
            title: 'NYa no se puede editar el conteo 1 y 2!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    }
    
};