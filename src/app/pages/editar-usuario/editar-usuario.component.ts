import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
  providers: [UsuarioService]
})
export class EditarUsuarioComponent implements OnInit {

  public usuario: Usuario;
  public idUsuario;

  constructor(private _usuarioService: UsuarioService, private _activateRoute: ActivatedRoute) {
    this.usuario = new Usuario();
  }


  ngOnInit(): void {
    this.obtenerParametro();
    this.obtenerUsuario();
  }

  onSubmit(form) {
    this._usuarioService.editarUsuario(this.usuario, this.idUsuario).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            // form.reset();
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },
      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      }
    )
  }

  obtenerUsuario() {
    this._usuarioService.obtenerUsuarioPorId(this.idUsuario).subscribe(
      resp => {
        this.usuario = resp;
      })
  }

  obtenerParametro() {
    this._activateRoute.params.subscribe(params => {
      this.idUsuario = params['id'];
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
