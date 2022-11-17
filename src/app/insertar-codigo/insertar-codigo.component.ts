import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-insertar-codigo',
  templateUrl: './insertar-codigo.component.html',
  styleUrls: ['./insertar-codigo.component.css'],
  providers: [AuthService]
})
export class InsertarCodigoComponent implements OnInit {
  public usuario: Usuario;
  public cargando: Boolean;

  constructor(    
    private _activateRoute: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router
    ) { 
    this.usuario = new Usuario()
  }


  ngOnInit(): void {
  }

  onSubmit(form){
    this.cargando = true;
    this._activateRoute.params.subscribe(params => {
      let correo = params['correo'];
      this.usuario.correo = correo;
      this._authService.InsertarCodigo(this.usuario).subscribe(
        resp => {
          if (resp) {
            if (resp.icono == 'success') {
              form.reset()
              
              this._router.navigate(['login']);
            }
            this.alerta(resp.icono, resp.title, resp.mensaje);
            this.cargando = false;
          }
        },
  
        err => {
          this.cargando = false;
          this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
  
  
        });
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
