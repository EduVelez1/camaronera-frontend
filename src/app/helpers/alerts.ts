import Swal from "sweetalert2";

export class Alert {

    alertBasica(icono, title, mensaje):any {
       Swal.fire({
            icon: icono,
            title: title,
            text: mensaje,
        });

    }

}
