import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
  providers: [AuthService]
})
export class RecuperarContrasenaComponent implements OnInit {
  public cargando: Boolean;

  public usuario: Usuario;
  constructor(private _authService: AuthService, private _router: Router) {

    this.usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    this.cargando = true;
    this._authService.recuperarContrasena(this.usuario).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this._router.navigate([`insertar-codigo/${this.usuario.correo}`]);
            form.reset()

          }
          this.cargando = false;
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },

      err => {
        this.cargando = false;
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');


      });



  }

  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });

  }

}
