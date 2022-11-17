import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {

  public usuario: Usuario;
  public identity;
  public token;
  public cargando = false;
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {

    this.usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    this.cargando = true;
    if (this.usuario.correo && this.usuario.contrasena) {


      this._authService.login(this.usuario).subscribe(

        resp => {
          if (resp && resp.code && resp.code == 404) {
            console.log(resp.message);
            this.cargando = false;
            this.alerta('error', 'Algo salió mal', resp.message);

          }
          else {
            // devuelve el token
            this.token = resp;
            this._authService.login(this.usuario, true).subscribe(
              resp2 => {
                this.identity = resp2;

                localStorage.setItem('token', this.token);
                localStorage.setItem('identity', JSON.stringify(this.identity));
                //    this._router.navigate(['inicio']);

                setTimeout(() => {
                  window.location.reload();
                }, 1);
                this.cargando = false;
              }

            )
          }


        },
        err => {

        }




      )
    }
  }
  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });

  }


}
